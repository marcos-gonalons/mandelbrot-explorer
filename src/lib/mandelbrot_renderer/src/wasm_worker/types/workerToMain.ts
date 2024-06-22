import { Size } from '../../types';

export enum WorkerToMainMessageType {
	INIT_WASM_FINISHED,
	INIT_WASM_ERROR,
	CALCULATE_SEGMENT_FINISHED,
	CALCULATION_PROGRESS,
	ADJUST_ZOOM_FINISHED,
	SET_ZOOM_FINISHED,
	ADJUST_OFFSETS_FINISHED,
	SET_OFFSETS_FINISHED,
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

export type WorkerToMainMessageData =
	| {
			type:
				| WorkerToMainMessageType.INIT_WASM_FINISHED
				| WorkerToMainMessageType.ADJUST_ZOOM_FINISHED
				| WorkerToMainMessageType.SET_MAX_ITERATIONS_FINISHED;
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
	  };

export type WorkerToMainPostMessage = (message: WorkerToMainMessageData) => void;
