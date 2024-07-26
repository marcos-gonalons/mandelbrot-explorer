import Bowser from 'bowser';
import Line from 'progressbar.js/line';
import { type Size } from '../../types';
import {
	type AdjustOffsetsMessage,
	type AdjustZoomMessage,
	MAIN_TO_WORKER_MESSAGE_TYPES,
	type MainToWorkerMessage,
	MainToWorkerMessageType,
	type MainToWorkerPostMessage,
	type SetColorAtMaxIterationsMessage,
	type SetMaxIterationsMessage,
	type SetOffsetsMessage,
	type SetStateMessage,
	type SetZoomMessage
} from '../../wasm_worker/types/mainToWorker';
import { NORMAL_RESOLUTION } from '../constants';
import {
	MAX_WORKERS_TO_SPAWN,
	MAX_WORKERS_TO_SPAWN_FIREFOX,
	MAX_WORKERS_TO_SPAWN_MOBILE,
	WASM_FILE_PATH,
	WORKERS_SCRIPT_PATH
} from './constants';
import { type Listeners, createListeners } from './listeners/main';

export type WorkersManager = ReturnType<typeof createWorkersManager>;

export const createWorkersManager = (
	getImageData: () => ImageData,
	getCanvas: () => HTMLCanvasElement,
	getCanvasContaier: () => HTMLDivElement,
	getCtx: () => CanvasRenderingContext2D,
	initCanvas: () => void,
	progressBar: Line
) => {
	let workers: Worker[] = [];

	const isExecutingFunctionMap = new Map<MainToWorkerMessageType, boolean>();
	MAIN_TO_WORKER_MESSAGE_TYPES.forEach((t) => isExecutingFunctionMap.set(t, false));

	const executionFinishedPromiseResolve = new Map<
		MainToWorkerMessageType,
		(...args: any) => void
	>();

	let listeners: Listeners = createListeners(
		getCanvas,
		getCanvasContaier,
		initCanvas,
		getCtx,
		() => workers,
		progressBar,
		(type) => {
			isExecutingFunctionMap.set(type, false);

			const resolvePromise = executionFinishedPromiseResolve.get(type);
			if (resolvePromise) resolvePromise();
		}
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
	const parallelizeCalculation = async (resolution: number = NORMAL_RESOLUTION) => {
		return new Promise((resolve) => {
			executionFinishedPromiseResolve.set(MainToWorkerMessageType.CALCULATE_SEGMENT, resolve);
			const canvasSize: Size = {
				width: Math.floor(getImageData().width / resolution),
				height: Math.floor(getImageData().height / resolution)
			};
			const size = canvasSize.width * canvasSize.height;
			const segmentLength = Math.floor(size / workers.length);
			const lastSegmentLength = segmentLength + (size % workers.length);

			const messages: MainToWorkerMessage[] = [];
			workers.forEach((_, index) => {
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
		});
	};

	const adjustZoom = async (data: AdjustZoomMessage['data']) => {
		return new Promise((resolve) => {
			executionFinishedPromiseResolve.set(MainToWorkerMessageType.ADJUST_ZOOM, resolve);
			invokeWorkers(
				Array<MainToWorkerMessage>(workers.length).fill({
					type: MainToWorkerMessageType.ADJUST_ZOOM,
					data
				})
			);
		});
	};

	const setZoom = async (data: SetZoomMessage['data']) => {
		return new Promise((resolve) => {
			executionFinishedPromiseResolve.set(MainToWorkerMessageType.SET_ZOOM, resolve);
			invokeWorkers(
				Array<MainToWorkerMessage>(workers.length).fill({
					type: MainToWorkerMessageType.SET_ZOOM,
					data
				})
			);
		});
	};

	const adjustOffsets = async (data: AdjustOffsetsMessage['data']) => {
		return new Promise((resolve) => {
			executionFinishedPromiseResolve.set(MainToWorkerMessageType.ADJUST_OFFSETS, resolve);
			invokeWorkers(
				Array<MainToWorkerMessage>(workers.length).fill({
					type: MainToWorkerMessageType.ADJUST_OFFSETS,
					data
				})
			);
		});
	};

	const setOffsets = async (data: SetOffsetsMessage['data']) => {
		return new Promise((resolve) => {
			executionFinishedPromiseResolve.set(MainToWorkerMessageType.SET_OFFSETS, resolve);
			invokeWorkers(
				Array<MainToWorkerMessage>(workers.length).fill({
					type: MainToWorkerMessageType.SET_OFFSETS,
					data
				})
			);
		});
	};

	const setMaxIterations = async (data: SetMaxIterationsMessage['data']) => {
		return new Promise((resolve) => {
			executionFinishedPromiseResolve.set(MainToWorkerMessageType.SET_MAX_ITERATIONS, resolve);
			invokeWorkers(
				Array<MainToWorkerMessage>(workers.length).fill({
					type: MainToWorkerMessageType.SET_MAX_ITERATIONS,
					data
				})
			);
		});
	};

	const setColorAtMaxIterations = async (data: SetColorAtMaxIterationsMessage['data']) => {
		return new Promise((resolve) => {
			executionFinishedPromiseResolve.set(
				MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS,
				resolve
			);
			invokeWorkers(
				Array<MainToWorkerMessage>(workers.length).fill({
					type: MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS,
					data
				})
			);
		});
	};

	const setState = async (data: SetStateMessage['data']) => {
		return new Promise((resolve) => {
			executionFinishedPromiseResolve.set(MainToWorkerMessageType.SET_STATE, resolve);
			invokeWorkers(
				Array<MainToWorkerMessage>(workers.length).fill({
					type: MainToWorkerMessageType.SET_STATE,
					data
				})
			);
		});
	};

	const invokeWorkers = (messages: MainToWorkerMessage[]) => {
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

		if (browser.getPlatform().type === 'mobile') {
			return MAX_WORKERS_TO_SPAWN_MOBILE;
		}
		if (browser.getBrowserName() === 'Firefox') {
			return MAX_WORKERS_TO_SPAWN_FIREFOX;
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

	const queue = (f: () => void) => {
		let interval = setInterval(() => {
			if (isExecutingAnyFunction()) return;

			f();
			clearInterval(interval);
		}, 50);
	};

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
		initCanvas,
		queue
	};
};
