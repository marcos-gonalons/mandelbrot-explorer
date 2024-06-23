import { Size } from '../../types';
import { MainToWorkerMessageType } from './mainToWorker';

export enum WorkerToMainMessageType {
	INIT_WASM_FINISHED,
	INIT_WASM_ERROR,
	CALCULATE_SEGMENT_FINISHED,
	CALCULATION_PROGRESS,
	ADJUST_ZOOM_FINISHED,
	SET_ZOOM_FINISHED,
	ADJUST_OFFSETS_FINISHED,
	SET_OFFSETS_FINISHED,
	SET_MAX_ITERATIONS_FINISHED,
	SET_COLOR_AT_MAX_ITERATIONS_FINISHED,
	SET_STATE_FINISHED
}

export function getMessageTypeMap(): Map<WorkerToMainMessageType, MainToWorkerMessageType> {
	const messageTypeMap = new Map<WorkerToMainMessageType, MainToWorkerMessageType>();

	messageTypeMap.set(WorkerToMainMessageType.INIT_WASM_FINISHED, MainToWorkerMessageType.INIT_WASM);
	messageTypeMap.set(WorkerToMainMessageType.INIT_WASM_ERROR, MainToWorkerMessageType.INIT_WASM);
	messageTypeMap.set(
		WorkerToMainMessageType.CALCULATE_SEGMENT_FINISHED,
		MainToWorkerMessageType.CALCULATE_SEGMENT
	);
	messageTypeMap.set(
		WorkerToMainMessageType.ADJUST_ZOOM_FINISHED,
		MainToWorkerMessageType.ADJUST_ZOOM
	);
	messageTypeMap.set(WorkerToMainMessageType.SET_ZOOM_FINISHED, MainToWorkerMessageType.SET_ZOOM);
	messageTypeMap.set(
		WorkerToMainMessageType.ADJUST_OFFSETS_FINISHED,
		MainToWorkerMessageType.ADJUST_OFFSETS
	);
	messageTypeMap.set(
		WorkerToMainMessageType.SET_OFFSETS_FINISHED,
		MainToWorkerMessageType.SET_OFFSETS
	);
	messageTypeMap.set(
		WorkerToMainMessageType.SET_MAX_ITERATIONS_FINISHED,
		MainToWorkerMessageType.SET_MAX_ITERATIONS
	);
	messageTypeMap.set(
		WorkerToMainMessageType.SET_COLOR_AT_MAX_ITERATIONS_FINISHED,
		MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS
	);
	messageTypeMap.set(WorkerToMainMessageType.SET_STATE_FINISHED, MainToWorkerMessageType.SET_STATE);

	return messageTypeMap;
}

export type InitWASMErrorData = {
	workerIndex: number;
};
export type CalculateSegmentFinishedData = {
	segment: Uint8ClampedArray;
	startsAt: number;
	canvasSize: Size;
	resolution: number;
};
export type AdjustOffsetsFinishedData = {
	offsets: {
		x: string;
		y: string;
	};
};
export type SetZoomFinishedData = {
	error: string | null;
};
export type SetOffsetsFinishedData = SetZoomFinishedData;
export type SetStateFinishedData = SetZoomFinishedData;

export type WorkerToMainMessageData =
	| {
			type:
				| WorkerToMainMessageType.INIT_WASM_FINISHED
				| WorkerToMainMessageType.ADJUST_ZOOM_FINISHED
				| WorkerToMainMessageType.SET_MAX_ITERATIONS_FINISHED
				| WorkerToMainMessageType.SET_COLOR_AT_MAX_ITERATIONS_FINISHED;
	  }
	| {
			type: WorkerToMainMessageType.CALCULATION_PROGRESS;
			data: { progress: number };
	  }
	| {
			type: WorkerToMainMessageType.CALCULATE_SEGMENT_FINISHED;
			data: CalculateSegmentFinishedData;
	  }
	| {
			type: WorkerToMainMessageType.INIT_WASM_ERROR;
			data: InitWASMErrorData;
	  }
	| {
			type: WorkerToMainMessageType.ADJUST_OFFSETS_FINISHED;
			data: AdjustOffsetsFinishedData;
	  }
	| {
			type: WorkerToMainMessageType.SET_OFFSETS_FINISHED;
			data: SetOffsetsFinishedData;
	  }
	| {
			type: WorkerToMainMessageType.SET_ZOOM_FINISHED;
			data: SetZoomFinishedData;
	  }
	| {
			type: WorkerToMainMessageType.SET_STATE_FINISHED;
			data: SetStateFinishedData;
	  };

export type WorkerToMainPostMessage = (message: WorkerToMainMessageData) => void;
