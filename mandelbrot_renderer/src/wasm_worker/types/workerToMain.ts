import { Size } from '../../types';

export enum WorkerToMainMessageType {
	INIT_WASM_FINISHED,
	INIT_WASM_ERROR,
	TRANSFER_BYTES_TEST_FINISHED,
	CALCULATE_SEGMENT_FINISHED,
	CALCULATION_PROGRESS,
	ADJUST_ZOOM_FINISHED,
	ADJUST_OFFSETS_FINISHED,
	SET_MAX_ITERATIONS_FINISHED
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
export type WorkerToMainMessageData =
	| {
			type:
				| WorkerToMainMessageType.INIT_WASM_FINISHED
				| WorkerToMainMessageType.ADJUST_ZOOM_FINISHED
				| WorkerToMainMessageType.ADJUST_OFFSETS_FINISHED
				| WorkerToMainMessageType.SET_MAX_ITERATIONS_FINISHED;
	  }
	| {
			type: WorkerToMainMessageType.CALCULATION_PROGRESS;
			data: { progress: number };
	  }
	| {
			type: WorkerToMainMessageType.TRANSFER_BYTES_TEST_FINISHED;
			data: { pixels: Uint8ClampedArray };
	  }
	| {
			type: WorkerToMainMessageType.CALCULATE_SEGMENT_FINISHED;
			data: CalculateSegmentFinishedData;
	  }
	| {
			type: WorkerToMainMessageType.INIT_WASM_ERROR;
			data: InitWASMErrorData;
	  };

export type WorkerToMainPostMessage = (message: WorkerToMainMessageData) => void;
