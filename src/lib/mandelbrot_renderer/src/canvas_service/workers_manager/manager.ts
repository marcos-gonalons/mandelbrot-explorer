import * as Bowser from 'bowser';
import { Size } from '../../types';
import {
	AdjustOffsetsData,
	AdjustZoomData,
	MainToWorkerMessageData,
	MainToWorkerMessageType,
	MainToWorkerPostMessage,
	SetColorAtMaxIterationsData,
	SetMaxIterationsData,
	SetOffsetsData,
	SetStateData,
	SetZoomData
} from '../../wasm_worker/types/mainToWorker';
import { NORMAL_RESOLUTION } from '../constants';
import {
	MAX_WORKERS_TO_SPAWN,
	MAX_WORKERS_TO_SPAWN_FIREFOX,
	MAX_WORKERS_TO_SPAWN_MOBILE,
	WASM_FILE_PATH,
	WORKERS_SCRIPT_PATH
} from './constants';
import { Listeners, createListeners } from './listeners';
import Line = require('progressbar.js/line');

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
		onAllWorkersInitialized: (workers: Worker[]) => void,
		onInitializationError: (e: Error) => void
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
						onAllWorkersInitialized(workers);
					},
					(e: Error) => {
						onInitializationError(e);
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
	const parallelizeCalculation = (resolution: number = NORMAL_RESOLUTION) => {
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

	const setState = (data: SetStateData) => {
		invokeWorkers(
			Array<MainToWorkerMessageData>(workers.length).fill({
				type: MainToWorkerMessageType.SET_STATE,
				data
			})
		);
	};

	const terminate = () => {
		// 1. call 1 worker and get state (zoom, offsets, max iterations, colors, operationmode)
		// 2. In listeners, listen to get state finished
		// terminate all workers
		// initialize all workers by calling init

		// at the end, call setState with the same state from getState BUT with less maxIterations

		workers.forEach((w) => w.terminate());
		progressBar.set(0);
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

	const isExecutingFunction = (workerFunction: MainToWorkerMessageType): boolean =>
		Boolean(
			Array.from(isExecutingFunctionMap.entries()).find((v) => v[0] === workerFunction && v[1])
		);

	const isCalculating = (): boolean =>
		isExecutingFunction(MainToWorkerMessageType.CALCULATE_SEGMENT);

	const isExecutingAnyFunction = (): boolean =>
		Boolean(Array.from(isExecutingFunctionMap.values()).find((isExecuting) => isExecuting));

	return {
		init,
		isCalculating,
		isExecutingFunction,
		isExecutingAnyFunction,
		parallelizeCalculation,
		adjustZoom,
		setZoom,
		adjustOffsets,
		setOffsets,
		setMaxIterations,
		setColorAtMaxIterations,
		setState,
		terminate
	};
};

function initIsExecutingFunctionMap(): Map<MainToWorkerMessageType, boolean> {
	const isExecutingFunctionMap = new Map<MainToWorkerMessageType, boolean>();

	isExecutingFunctionMap.set(MainToWorkerMessageType.INIT_WASM, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.CALCULATE_SEGMENT, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.ADJUST_OFFSETS, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.SET_OFFSETS, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.ADJUST_ZOOM, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.SET_ZOOM, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.SET_MAX_ITERATIONS, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS, false);
	isExecutingFunctionMap.set(MainToWorkerMessageType.SET_STATE, false);

	return isExecutingFunctionMap;
}
