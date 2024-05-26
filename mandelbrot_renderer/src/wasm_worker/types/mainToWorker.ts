import { ZoomingStrategy } from '../../canvas_service/zoomHandler';
import { Size } from '../../types';

export enum MainToWorkerMessageType {
	INIT_WASM,
	TRANSFER_BYTES_TEST,
	CALCULATE_SEGMENT,
	ADJUST_OFFSETS,
	ADJUST_ZOOM
}

export type InitWASMData = {
	workerIndex: number;
	wasmBytes: ArrayBuffer;
};

export type CalculateSegmentData = {
	canvasSize: Size;
	segmentLength: number;
	startsAt: number;
	resolution: number;
};

export type AdjustOffsetsData = {
	speed: number;
	angleInDegrees: number;
};
export type AdjustZoomData = {
	type: boolean;
	strategy: ZoomingStrategy;
	speed: number;
	mouseCoordinates: number[];
	canvasSize: Size;
};

export type MainToWorkerMessageData =
	| {
			type: MainToWorkerMessageType.TRANSFER_BYTES_TEST;
	  }
	| {
			type: MainToWorkerMessageType.ADJUST_ZOOM;
			data: AdjustZoomData;
	  }
	| {
			type: MainToWorkerMessageType.ADJUST_OFFSETS;
			data: AdjustOffsetsData;
	  }
	| {
			type: MainToWorkerMessageType.INIT_WASM;
			data: InitWASMData;
	  }
	| {
			type: MainToWorkerMessageType.CALCULATE_SEGMENT;
			data: CalculateSegmentData;
	  };

export type MainToWorkerPostMessage = (message: MainToWorkerMessageData) => void;
