import * as Bowser from 'bowser';
import Line = require('progressbar.js/line');
import {
	AdjustOffsetsData,
	AdjustZoomData,
	MainToWorkerMessageData,
	MainToWorkerMessageType,
	MainToWorkerPostMessage,
	SetColorAtMaxIterationsData,
	SetMaxIterationsData,
	SetOffsetsData,
	SetZoomData
} from '../../wasm_worker/types/mainToWorker';
import { Listeners, createListeners } from './listeners';
import {
	WASM_FILE_PATH,
	MAX_WORKERS_TO_SPAWN,
	MAX_WORKERS_TO_SPAWN_FIREFOX,
	WORKERS_SCRIPT_PATH,
	MAX_WORKERS_TO_SPAWN_MOBILE
} from './constants';
import { Size } from '../../types';

export type WorkersManager = ReturnType<typeof createWorkersManager>;
export const createWorkersManager = (
	getImageData: () => ImageData,
	getCanvas: () => HTMLCanvasElement,
	getCtx: () => CanvasRenderingContext2D,
	progressBar: Line
) => {
	let workers: Worker[] = [];
	let isExecutingFunctionMap = initIsExecutingFunctionMap();
	let listeners: Listeners = createListeners(
		getCanvas,
		getCtx,
		() => workers,
		progressBar,
		(type) => isExecutingFunctionMap.set(type, false)
	);

	const init = async (): Promise<Worker[]> => {
		return new Promise<Worker[]>(startAllWorkers);
	};

	const startAllWorkers = async (
		resolveWorkersInitializationPromise: (workers: Worker[]) => void,
		rejectWorkersInitializationPromise: (e: Error) => void
	): Promise<void> => {
		const wasmBytes = await getWasmBytes();
		const workerScriptCode = await getWorkerScriptCode();
		for (let i = 0; i < getMaxWorkersToSpawn(); i++) {
			const worker = new Worker(workerScriptCode);
			workers.push(worker);

			worker.onmessage = (e) =>
				listeners.onNewWorkerMessageReceived(
					e,
					() => {
						workers = workers.filter(Boolean);
						resolveWorkersInitializationPromise(workers);
					},
					(e: Error) => {
						rejectWorkersInitializationPromise(e);
					}
				);

			(worker.postMessage as MainToWorkerPostMessage)({
				type: MainToWorkerMessageType.INIT_WASM,
				data: {
					workerIndex: i,
					wasmBytes
				}
			});
		}
	};

	/** @param resolution - The higher the number the worse the resolution */
	const parallelizeCalculation = (resolution: number = 1) => {
		const canvasSize: Size = {
			width: Math.floor(getImageData().width / resolution),
			height: Math.floor(getImageData().height / resolution)
		};
		const size = canvasSize.width * canvasSize.height;
		const segmentLength = Math.floor(size / workers.length);
		const lastSegmentLength = segmentLength + (size % workers.length);

		const messages: MainToWorkerMessageData[] = [];
		workers.forEach((worker, index) => {
			messages.push({
				type: MainToWorkerMessageType.CALCULATE_SEGMENT,
				data: {
					resolution,
					canvasSize,
					startsAt: 4 * index * segmentLength,
					segmentLength: (index === workers.length - 1 ? lastSegmentLength : segmentLength) * 4
				}
			});
		});

		invokeWorkers(messages);
	};

	const adjustZoom = (data: AdjustZoomData) => {
		invokeWorkers(
			Array<MainToWorkerMessageData>(workers.length).fill({
				type: MainToWorkerMessageType.ADJUST_ZOOM,
				data
			})
		);
	};

	const setZoom = (data: SetZoomData) => {
		invokeWorkers(
			Array<MainToWorkerMessageData>(workers.length).fill({
				type: MainToWorkerMessageType.SET_ZOOM,
				data
			})
		);
	};

	const adjustOffsets = (data: AdjustOffsetsData) => {
		invokeWorkers(
			Array<MainToWorkerMessageData>(workers.length).fill({
				type: MainToWorkerMessageType.ADJUST_OFFSETS,
				data
			})
		);
	};

	const setOffsets = (data: SetOffsetsData) => {
		invokeWorkers(
			Array<MainToWorkerMessageData>(workers.length).fill({
				type: MainToWorkerMessageType.SET_OFFSETS,
				data
			})
		);
	};

	const setMaxIterations = (data: SetMaxIterationsData) => {
		invokeWorkers(
			Array<MainToWorkerMessageData>(workers.length).fill({
				type: MainToWorkerMessageType.SET_MAX_ITERATIONS,
				data
			})
		);
	};

	const setColorAtMaxIterations = (data: SetColorAtMaxIterationsData) => {
		invokeWorkers(
			Array<MainToWorkerMessageData>(workers.length).fill({
				type: MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS,
				data
			})
		);
	};

	const invokeWorkers = (messages: MainToWorkerMessageData[]) => {
		if (isCalculating()) return;

		workers.forEach((worker: Worker, index: number) => {
			isExecutingFunctionMap.set(messages[index].type, true);
			worker.postMessage(messages[index]);
		});
	};

	const getWasmBytes = async (): Promise<ArrayBuffer> => {
		const response = await fetch(new URL(WASM_FILE_PATH, document.baseURI).toString());
		const bytes = await response.arrayBuffer();
		return bytes;
	};

	const getWorkerScriptCode = async (): Promise<string> => {
		const response = await fetch(WORKERS_SCRIPT_PATH);

		const blob = new Blob([await response.text()], {
			type: 'application/javascript'
		});

		return URL.createObjectURL(blob);
	};

	const getMaxWorkersToSpawn = (): number => {
		const browser = Bowser.getParser(window.navigator.userAgent);

		if (browser.getBrowserName() === 'Firefox') {
			return MAX_WORKERS_TO_SPAWN_FIREFOX;
		}
		if (browser.getPlatform().type === 'mobile') {
			return MAX_WORKERS_TO_SPAWN_MOBILE;
		}

		return MAX_WORKERS_TO_SPAWN;
	};

	const isCalculating = () =>
		Array.from(isExecutingFunctionMap.entries()).filter(
			(v) => v[0] === MainToWorkerMessageType.CALCULATE_SEGMENT && v[1]
		).length > 0;

	return {
		init,
		isCalculating,
		parallelizeCalculation,
		adjustZoom,
		setZoom,
		adjustOffsets,
		setOffsets,
		setMaxIterations,
		setColorAtMaxIterations
	};
};

function initIsExecutingFunctionMap(): Map<MainToWorkerMessageData['type'], boolean> {
	const isExecutingFunctionMap = new Map<MainToWorkerMessageData['type'], boolean>();

	isExecutingFunctionMap.set(MainToWorkerMessageType.INIT_WASM, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.CALCULATE_SEGMENT, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.ADJUST_OFFSETS, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.SET_OFFSETS, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.ADJUST_ZOOM, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.SET_ZOOM, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.SET_MAX_ITERATIONS, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS, false);

	return isExecutingFunctionMap;
}
