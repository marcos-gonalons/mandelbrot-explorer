import { type Size } from '../../types';
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
	SET_COLOR_SCHEME_FINISHED,
	SET_SATURATION_FINISHED,
	SET_COLOR_CHANGE_FREQUENCY_FINISHED,
	SET_STATE_FINISHED,
	MAX_FLOAT64_DEPTH_REACHED,
	MAX_FLOAT128_DEPTH_REACHED
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
	messageTypeMap.set(
		WorkerToMainMessageType.SET_COLOR_SCHEME_FINISHED,
		MainToWorkerMessageType.SET_COLOR_SCHEME
	);
	messageTypeMap.set(
		WorkerToMainMessageType.SET_SATURATION_FINISHED,
		MainToWorkerMessageType.SET_SATURATION
	);
	messageTypeMap.set(
		WorkerToMainMessageType.SET_COLOR_CHANGE_FREQUENCY_FINISHED,
		MainToWorkerMessageType.SET_COLOR_CHANGE_FREQUENCY
	);
	messageTypeMap.set(WorkerToMainMessageType.SET_STATE_FINISHED, MainToWorkerMessageType.SET_STATE);

	return messageTypeMap;
}

export type InitWASMFinishedMessage = {
	type: WorkerToMainMessageType.INIT_WASM_FINISHED;
};
export type InitWASMErrorMessage = {
	type: WorkerToMainMessageType.INIT_WASM_ERROR;
	data: { workerIndex: number };
};
export type SetMaxIterationsMessage = {
	type: WorkerToMainMessageType.SET_MAX_ITERATIONS_FINISHED;
};
export type SetColorAtMaxIterationsMessage = {
	type: WorkerToMainMessageType.SET_COLOR_AT_MAX_ITERATIONS_FINISHED;
};
export type SetColorSchemeMessage = {
	type: WorkerToMainMessageType.SET_COLOR_SCHEME_FINISHED;
};
export type SetSaturationMessage = {
	type: WorkerToMainMessageType.SET_SATURATION_FINISHED;
};
export type SetColorChangeFrequencyMessage = {
	type: WorkerToMainMessageType.SET_COLOR_CHANGE_FREQUENCY_FINISHED;
};
export type CalculationProgressMessage = {
	type: WorkerToMainMessageType.CALCULATION_PROGRESS;
	data: { progress: number };
};
export type CalculateSegmentFinishedMessage = {
	type: WorkerToMainMessageType.CALCULATE_SEGMENT_FINISHED;
	data: {
		segment: Uint8ClampedArray;
		startsAt: number;
		canvasSize: Size;
		resolution: number;
	};
};
export type AdjustOffsetsFinisheMessage = {
	type: WorkerToMainMessageType.ADJUST_OFFSETS_FINISHED;
	data: {
		offsets: {
			x: string;
			y: string;
		};
	};
};
export type SetOffsetsFinishedMessage = {
	type: WorkerToMainMessageType.SET_OFFSETS_FINISHED;
	data: { error: string | null };
};
export type AdjustZoomFinishedMessage = {
	type: WorkerToMainMessageType.ADJUST_ZOOM_FINISHED;
	data: {
		zoomAsENotation: string;
		xOffsetAsENotation: string;
		yOffsetAsENotation: string;
	};
};
export type SetZoomFinishedMessage = {
	type: WorkerToMainMessageType.SET_ZOOM_FINISHED;
	data: { error: string | null };
};
export type SetStateFinishedMessage = {
	type: WorkerToMainMessageType.SET_STATE_FINISHED;
	data: { error: string | null };
};
export type MaxFloat64DepthReachedMessage = {
	type: WorkerToMainMessageType.MAX_FLOAT64_DEPTH_REACHED;
};
export type MaxFloat128DepthReachedMessage = {
	type: WorkerToMainMessageType.MAX_FLOAT128_DEPTH_REACHED;
};

export type WorkerToMainMessage =
	| InitWASMFinishedMessage
	| InitWASMErrorMessage
	| SetMaxIterationsMessage
	| SetColorAtMaxIterationsMessage
	| SetColorSchemeMessage
	| SetSaturationMessage
	| SetColorChangeFrequencyMessage
	| CalculationProgressMessage
	| CalculateSegmentFinishedMessage
	| AdjustOffsetsFinisheMessage
	| SetOffsetsFinishedMessage
	| AdjustZoomFinishedMessage
	| SetZoomFinishedMessage
	| SetStateFinishedMessage
	| MaxFloat64DepthReachedMessage
	| MaxFloat128DepthReachedMessage;

export type WorkerToMainPostMessage = (message: WorkerToMainMessage) => void;
