import * as Bowser from 'bowser';
import Line = require('progressbar.js/line');
import {
	AdjustOffsetsData,
	AdjustZoomData,
	CalculateSegmentData,
	MainToWorkerMessageType,
	MainToWorkerPostMessage,
	SetMaxIterationsData
} from '../../wasm_worker/types/mainToWorker';
import { Listeners, createListeners } from './listeners';
import {
	WASM_FILE_PATH,
	MAX_WORKERS_TO_SPAWN,
	MAX_WORKERS_TO_SPAWN_FIREFOX,
	WORKERS_SCRIPT_PATH
} from './constants';
import { Size } from '../../types';

export enum WorkerFunction {
	CALCULATE,
	ADJUST_OFFSETS,
	ADJUST_ZOOM,
	SET_MAX_ITERATIONS
}

export type WorkersManager = ReturnType<typeof createWorkersManager>;
export const createWorkersManager = (
	getImageData: () => ImageData,
	getCanvas: () => HTMLCanvasElement,
	getCtx: () => CanvasRenderingContext2D,
	progressBar: Line
) => {
	let isCalculating: boolean = false;
	let workers: Worker[] = [];

	let listeners: Listeners = createListeners(
		getCanvas,
		getCtx,
		() => workers,
		progressBar,
		() => (isCalculating = false)
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

	function call(functionName: WorkerFunction.CALCULATE, resolution?: number): void;
	function call(functionName: WorkerFunction.ADJUST_ZOOM, data: AdjustZoomData): void;
	function call(functionName: WorkerFunction.ADJUST_OFFSETS, data: AdjustOffsetsData): void;
	function call(functionName: WorkerFunction.SET_MAX_ITERATIONS, data: SetMaxIterationsData): void;
	function call(functionName: WorkerFunction, ...args: any): void {
		if (workers.length === 0 || isCalculating) return;

		switch (functionName) {
			case WorkerFunction.CALCULATE:
				parallelizeCalculation(args[0]);
				break;
			case WorkerFunction.ADJUST_ZOOM:
				adjustZoom(args[0]);
				break;
			case WorkerFunction.ADJUST_OFFSETS:
				adjustOffsets(args[0]);
				break;
			case WorkerFunction.SET_MAX_ITERATIONS:
				setMaxIterations(args[0]);
				break;
		}
	}

	/** @param resolution - The higher the number the worse the resolution */
	const parallelizeCalculation = (resolution: number = 1) => {
		isCalculating = true;

		const canvasSize: Size = {
			width: Math.floor(getImageData().width / resolution),
			height: Math.floor(getImageData().height / resolution)
		};
		const size = canvasSize.width * canvasSize.height;
		const segmentLength = Math.floor(size / workers.length);
		const lastSegmentLength = segmentLength + (size % workers.length);

		workers.forEach((worker, index) => {
			const message: {
				type: MainToWorkerMessageType.CALCULATE_SEGMENT;
				data: CalculateSegmentData;
			} = {
				type: MainToWorkerMessageType.CALCULATE_SEGMENT,
				data: {
					resolution,
					canvasSize,
					startsAt: 4 * index * segmentLength,
					segmentLength: (index === workers.length - 1 ? lastSegmentLength : segmentLength) * 4
				}
			};
			(worker.postMessage as MainToWorkerPostMessage)(message);
		});
	};

	const adjustZoom = (data: AdjustZoomData) => {
		workers.forEach((worker) => {
			(worker.postMessage as MainToWorkerPostMessage)({
				type: MainToWorkerMessageType.ADJUST_ZOOM,
				data
			});
		});
	};

	const adjustOffsets = (data: AdjustOffsetsData) => {
		workers.forEach((worker) => {
			(worker.postMessage as MainToWorkerPostMessage)({
				type: MainToWorkerMessageType.ADJUST_OFFSETS,
				data
			});
		});
	};

	const setMaxIterations = (data: SetMaxIterationsData) => {
		workers.forEach((worker) => {
			(worker.postMessage as MainToWorkerPostMessage)({
				type: MainToWorkerMessageType.SET_MAX_ITERATIONS,
				data
			});
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

		return MAX_WORKERS_TO_SPAWN;
	};

	return {
		init,
		call,
		isCalculating: () => isCalculating
	};
};
