import Line = require('progressbar.js/line');

import {
	WorkerToMainMessageData,
	WorkerToMainMessageType,
	InitWASMErrorData,
	CalculateSegmentFinishedData
} from '../../wasm_worker/types/workerToMain';
import { Size } from '../../types';

export type Listeners = ReturnType<typeof createListeners>;
export const createListeners = (
	getCanvas: () => HTMLCanvasElement,
	getCtx: () => CanvasRenderingContext2D,
	progressBar: Line,
	workers: Worker[],
	onFinishRenderCallback: () => void
) => {
	let finishedSegments: CalculateSegmentFinishedData[] = [];
	let totalSuccesses: number = 0;
	let totalErrors: number = 0;

	const onNewWorkerMessageReceived = (
		{ data: message }: MessageEvent<WorkerToMainMessageData>,
		onWorkersInitialized: (workers: Worker[]) => void,
		onFailure: (e: Error) => void
	): void => {
		switch (message.type) {
			case WorkerToMainMessageType.INIT_WASM_FINISHED:
				onInitWASMFinished(onWorkersInitialized);
				break;
			case WorkerToMainMessageType.INIT_WASM_ERROR:
				onInitWASMError(message.data, onWorkersInitialized, onFailure);
				break;
			case WorkerToMainMessageType.TRANSFER_BYTES_TEST_FINISHED:
				break;
			case WorkerToMainMessageType.CALCULATE_SEGMENT_FINISHED:
				onSegmentFinished(message.data);
				break;
			case WorkerToMainMessageType.CALCULATION_PROGRESS:
				progressBar.animate(message.data.progress, { duration: 100 });
				break;
			case WorkerToMainMessageType.ADJUST_OFFSETS_FINISHED:
				break;
			case WorkerToMainMessageType.ADJUST_ZOOM_FINISHED:
				break;
		}
	};

	const onInitWASMFinished = (onWorkersInitialized: (workers: Worker[]) => void): void => {
		totalSuccesses++;

		if (totalErrors + totalSuccesses === workers.length) {
			onWorkersInitialized(workers);
		}
	};

	const onInitWASMError = (
		{ workerIndex }: InitWASMErrorData,
		onWorkersInitialized: (workers: Worker[]) => void,
		onFailure: (e: Error) => void
	): void => {
		totalErrors++;
		workers[workerIndex].terminate();
		workers[workerIndex] = null;

		if (totalErrors === workers.length) {
			onFailure(new Error('Unable to initialize any worker'));
			return;
		}
		if (totalErrors + totalSuccesses === workers.length) {
			onWorkersInitialized(workers);
		}
	};

	const onSegmentFinished = (data: CalculateSegmentFinishedData): void => {
		finishedSegments.push(data);
		if (finishedSegments.length < workers.length) return;

		if (data.resolution <= 1) {
			progressBar.animate(1, { duration: 200 }, () => setTimeout(() => progressBar.set(0), 100));
		}

		renderMandelbrot(data.canvasSize);

		finishedSegments = [];
		onFinishRenderCallback();
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

	return { onNewWorkerMessageReceived };
};
