import Line = require('progressbar.js/line');

import {
	MAIN_TO_WORKER_MESSAGE_TYPES,
	MainToWorkerMessageType
} from '../../../wasm_worker/types/mainToWorker';
import {
	WorkerToMainMessage,
	WorkerToMainMessageType,
	getMessageTypeMap
} from '../../../wasm_worker/types/workerToMain';
import { calculateSegmentFinishedListener } from './calculateSegmentFinishedListener/listener';
import { calculationProgressListener } from './calculationProgressListener/listener';
import { initWasmListener } from './initWasmListener/listener';
import { maxFloat128DepthReachedListener } from './maxFloat128DepthReachedListener/listener';
import { maxFloat64DepthReachedListener } from './maxFloat64DepthReachedListener/listener';

export type Listeners = ReturnType<typeof createListeners>;
export const createListeners = (
	getCanvas: () => HTMLCanvasElement,
	getCanvasContainer: () => HTMLDivElement,
	initCanvas: () => void,
	getCtx: () => CanvasRenderingContext2D,
	getWorkers: () => Worker[],
	progressBar: Line,
	onFinishFunctionExecutionCallback: (type: MainToWorkerMessageType) => void
) => {
	const finishedByTypeMap = new Map<MainToWorkerMessageType, number>();
	MAIN_TO_WORKER_MESSAGE_TYPES.forEach((t) => finishedByTypeMap.set(t, 0));

	const onNewWorkerMessageReceived = (
		messageEvent: MessageEvent<WorkerToMainMessage>,
		onWorkersInitialized: (workers: Worker[]) => void,
		onFailure: (e: Error) => void
	): void => {
		const workerMessage = messageEvent.data;

		handleFinishExecutionCallback(getMessageTypeMap().get(workerMessage.type));

		switch (workerMessage.type) {
			case WorkerToMainMessageType.INIT_WASM_FINISHED:
			case WorkerToMainMessageType.INIT_WASM_ERROR:
				initWasmListener(messageEvent, getWorkers(), onWorkersInitialized, onFailure);
				break;
			case WorkerToMainMessageType.CALCULATE_SEGMENT_FINISHED:
				calculateSegmentFinishedListener(
					workerMessage.data,
					progressBar,
					getWorkers(),
					getCanvas(),
					getCtx()
				);
				break;
			case WorkerToMainMessageType.CALCULATION_PROGRESS:
				calculationProgressListener(progressBar, workerMessage.data);
				break;
			case WorkerToMainMessageType.MAX_FLOAT64_DEPTH_REACHED:
				maxFloat64DepthReachedListener(getCanvasContainer(), initCanvas);
				break;
			case WorkerToMainMessageType.MAX_FLOAT128_DEPTH_REACHED:
				maxFloat128DepthReachedListener();
				break;
		}
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
