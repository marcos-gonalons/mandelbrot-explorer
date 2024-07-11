import { ZoomingStrategy } from '../../canvas_service/zoomHandler';
import { type RGBColor, type Size } from '../../types';

export enum MainToWorkerMessageType {
	INIT_WASM,
	CALCULATE_SEGMENT,
	ADJUST_OFFSETS,
	SET_OFFSETS,
	ADJUST_ZOOM,
	SET_ZOOM,
	SET_MAX_ITERATIONS,
	SET_COLOR_AT_MAX_ITERATIONS,
	SET_STATE
}
export const MAIN_TO_WORKER_MESSAGE_TYPES: MainToWorkerMessageType[] = [
	MainToWorkerMessageType.INIT_WASM,
	MainToWorkerMessageType.CALCULATE_SEGMENT,
	MainToWorkerMessageType.ADJUST_OFFSETS,
	MainToWorkerMessageType.SET_OFFSETS,
	MainToWorkerMessageType.ADJUST_ZOOM,
	MainToWorkerMessageType.SET_ZOOM,
	MainToWorkerMessageType.SET_MAX_ITERATIONS,
	MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS,
	MainToWorkerMessageType.SET_STATE
];

export type AdjustZoomMessage = {
	type: MainToWorkerMessageType.ADJUST_ZOOM;
	data: {
		type: boolean;
		strategy: ZoomingStrategy;
		speed: number;
		mouseCoordinates: number[];
		canvasSize: Size;
	};
};
export type SetZoomMessage = {
	type: MainToWorkerMessageType.SET_ZOOM;
	data: { zoomLevelAsENotation: string };
};
export type AdjustOffsetsMessage = {
	type: MainToWorkerMessageType.ADJUST_OFFSETS;
	data: { speed: number; angleInDegrees: number };
};
export type SetOffsetsMessage = {
	type: MainToWorkerMessageType.SET_OFFSETS;
	data: { xAsENotation: string; yAsENotation: string };
};
export type InitWASMMessage = {
	type: MainToWorkerMessageType.INIT_WASM;
	data: { workerIndex: number; wasmBytes: ArrayBuffer };
};
export type CalculateSegmentMessage = {
	type: MainToWorkerMessageType.CALCULATE_SEGMENT;
	data: { canvasSize: Size; segmentLength: number; startsAt: number; resolution: number };
};
export type SetMaxIterationsMessage = {
	type: MainToWorkerMessageType.SET_MAX_ITERATIONS;
	data: { value: number };
};
export type SetColorAtMaxIterationsMessage = {
	type: MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS;
	data: { color: RGBColor };
};
export enum OperationMode {
	FLOAT64 = 0,
	FLOAT128 = 1
}
export type SetStateMessage = {
	type: MainToWorkerMessageType.SET_STATE;
	data: {
		state: {
			operationMode: OperationMode;
			maxIterations: number;
			zoomAsENotation: string;
			magnitudeAsENotation: string;
			magnitudeDecimals: string;
			offsetsAsENotation: {
				x: string;
				y: string;
			};
			colorAtMaxIterations: RGBColor;
		};
	};
};

export type MainToWorkerMessage =
	| AdjustZoomMessage
	| SetZoomMessage
	| AdjustOffsetsMessage
	| SetOffsetsMessage
	| InitWASMMessage
	| CalculateSegmentMessage
	| SetMaxIterationsMessage
	| SetColorAtMaxIterationsMessage
	| SetStateMessage;

export type MainToWorkerPostMessage = (message: MainToWorkerMessage) => void;
