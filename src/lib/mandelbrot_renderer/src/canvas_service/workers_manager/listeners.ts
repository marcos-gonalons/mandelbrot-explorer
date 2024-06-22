import Line = require('progressbar.js/line');

import { Size } from '../../types';
import { MainToWorkerMessageType } from '../../wasm_worker/types/mainToWorker';
import {
	CalculateSegmentFinishedData,
	InitWASMErrorData,
	WorkerToMainMessageData,
	WorkerToMainMessageType
} from '../../wasm_worker/types/workerToMain';

export type Listeners = ReturnType<typeof createListeners>;
export const createListeners = (
	getCanvas: () => HTMLCanvasElement,
	getCtx: () => CanvasRenderingContext2D,
	getWorkers: () => Worker[],
	progressBar: Line,
	onFinishFunctionExecutionCallback: (type: MainToWorkerMessageType) => void
) => {
	let finishedSegments: CalculateSegmentFinishedData[] = [];
	let totalSuccesses: number = 0;
	let totalErrors: number = 0;
	let finishedByTypeMap = initFinishedByTypeMap();

	const onNewWorkerMessageReceived = (
		{ data: message }: MessageEvent<WorkerToMainMessageData>,
		onWorkersInitialized: (workers: Worker[]) => void,
		onFailure: (e: Error) => void
	): void => {
		switch (message.type) {
			case WorkerToMainMessageType.INIT_WASM_FINISHED:
				handleFinishExecutionCallback(MainToWorkerMessageType.INIT_WASM);
				onInitWASMFinished(onWorkersInitialized);
				break;
			case WorkerToMainMessageType.INIT_WASM_ERROR:
				handleFinishExecutionCallback(MainToWorkerMessageType.INIT_WASM);
				onInitWASMError(message.data, onWorkersInitialized, onFailure);
				break;
			case WorkerToMainMessageType.CALCULATE_SEGMENT_FINISHED:
				handleFinishExecutionCallback(MainToWorkerMessageType.CALCULATE_SEGMENT);
				onSegmentFinished(message.data);
				break;
			case WorkerToMainMessageType.CALCULATION_PROGRESS:
				progressBar.animate(message.data.progress, { duration: 100 });
				break;
			case WorkerToMainMessageType.ADJUST_OFFSETS_FINISHED:
				handleFinishExecutionCallback(MainToWorkerMessageType.ADJUST_OFFSETS);
				break;
			case WorkerToMainMessageType.SET_OFFSETS_FINISHED:
				handleFinishExecutionCallback(MainToWorkerMessageType.SET_OFFSETS);
				break;
			case WorkerToMainMessageType.ADJUST_ZOOM_FINISHED:
				handleFinishExecutionCallback(MainToWorkerMessageType.ADJUST_ZOOM);
				break;
			case WorkerToMainMessageType.SET_ZOOM_FINISHED:
				handleFinishExecutionCallback(MainToWorkerMessageType.SET_ZOOM);
				break;
			case WorkerToMainMessageType.SET_MAX_ITERATIONS_FINISHED:
				handleFinishExecutionCallback(MainToWorkerMessageType.SET_MAX_ITERATIONS);
				break;
			case WorkerToMainMessageType.SET_COLOR_AT_MAX_ITERATIONS_FINISHED:
				handleFinishExecutionCallback(MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS);
				break;
		}
	};

	const onInitWASMFinished = (onWorkersInitialized: (workers: Worker[]) => void): void => {
		totalSuccesses++;

		if (totalErrors + totalSuccesses === getWorkers().length) {
			onWorkersInitialized(getWorkers());
		}
	};

	const onInitWASMError = (
		{ workerIndex }: InitWASMErrorData,
		onWorkersInitialized: (workers: Worker[]) => void,
		onFailure: (e: Error) => void
	): void => {
		totalErrors++;
		getWorkers()[workerIndex].terminate();
		getWorkers()[workerIndex] = null;

		if (totalErrors === getWorkers().length) {
			onFailure(new Error('Unable to initialize any worker'));
			return;
		}
		if (totalErrors + totalSuccesses === getWorkers().length) {
			onWorkersInitialized(getWorkers());
		}
	};

	const onSegmentFinished = (data: CalculateSegmentFinishedData): void => {
		finishedSegments.push(data);
		if (finishedSegments.length < getWorkers().length) return;

		if (data.resolution <= 1) {
			progressBar.animate(1, { duration: 200 }, () => setTimeout(() => progressBar.set(0), 100));
		}

		renderMandelbrot(data.canvasSize);

		finishedSegments = [];
	};

	const renderMandelbrot = ({ width, height }: Size) => {
		const visibleCanvas = getCanvas();
		const visibleContext = getCtx();

		const imageData = visibleContext.createImageData(width, height);

		finishedSegments.forEach((v) =>
			v.segment.forEach(
				(pixelData: number, i: number) => (imageData.data[i + v.startsAt] = pixelData)
			)
		);

		const invisibleCanvas = document.createElement('canvas');
		const invisibleCtx = invisibleCanvas.getContext('2d');
		invisibleCanvas.width = imageData.width;
		invisibleCanvas.height = imageData.height;

		invisibleCtx.putImageData(imageData, 0, 0);

		const invisibleCanvasImage = new Image();
		invisibleCanvasImage.src = invisibleCanvas.toDataURL();

		invisibleCanvasImage.onload = () => {
			visibleContext.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
			visibleContext.drawImage(
				invisibleCanvasImage,
				0,
				0,
				visibleCanvas.width,
				visibleCanvas.height
			);
		};

		invisibleCanvas.remove();
		invisibleCanvasImage.remove();
	};

	const handleFinishExecutionCallback = (type: MainToWorkerMessageType) => {
		let finishedAmount = finishedByTypeMap.get(type);
		finishedAmount++;

		if (finishedAmount !== getWorkers().length) {
			finishedByTypeMap.set(type, finishedAmount);
			return;
		}

		onFinishFunctionExecutionCallback(type);
		finishedByTypeMap.set(type, 0);
	};

	return { onNewWorkerMessageReceived };
};

function initFinishedByTypeMap(): Map<MainToWorkerMessageType, number> {
	const finishedByType = new Map<MainToWorkerMessageType, number>();

	finishedByType.set(MainToWorkerMessageType.INIT_WASM, 0);
	finishedByType.set(MainToWorkerMessageType.CALCULATE_SEGMENT, 0);
	finishedByType.set(MainToWorkerMessageType.ADJUST_OFFSETS, 0);
	finishedByType.set(MainToWorkerMessageType.SET_OFFSETS, 0);
	finishedByType.set(MainToWorkerMessageType.ADJUST_ZOOM, 0);
	finishedByType.set(MainToWorkerMessageType.SET_ZOOM, 0);
	finishedByType.set(MainToWorkerMessageType.SET_MAX_ITERATIONS, 0);
	finishedByType.set(MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS, 0);

	return finishedByType;
}
