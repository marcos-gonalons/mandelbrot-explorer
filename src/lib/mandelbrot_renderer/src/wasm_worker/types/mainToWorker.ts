import { ZoomingStrategy } from '../../canvas_service/zoomHandler';
import { RGBColor, Size } from '../../types';

export enum MainToWorkerMessageType {
	INIT_WASM,
	CALCULATE_SEGMENT,
	ADJUST_OFFSETS,
	SET_OFFSETS,
	ADJUST_ZOOM,
	SET_ZOOM,
	SET_MAX_ITERATIONS,
	SET_COLOR_AT_MAX_ITERATIONS
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
export type SetOffsetsData = {
	xAsENotation: string;
	yAsENotation: string;
};
export type AdjustZoomData = {
	type: boolean;
	strategy: ZoomingStrategy;
	speed: number;
	mouseCoordinates: number[];
	canvasSize: Size;
};
export type SetZoomData = {
	zoomLevelAsENotation: string;
};
export type SetMaxIterationsData = {
	value: number;
};
export type SetColorAtMaxIterationsData = {
	color: RGBColor;
};

export type MainToWorkerMessageData =
	| {
			type: MainToWorkerMessageType.ADJUST_ZOOM;
			data: AdjustZoomData;
	  }
	| {
			type: MainToWorkerMessageType.SET_ZOOM;
			data: SetZoomData;
	  }
	| {
			type: MainToWorkerMessageType.ADJUST_OFFSETS;
			data: AdjustOffsetsData;
	  }
	| {
			type: MainToWorkerMessageType.SET_OFFSETS;
			data: SetOffsetsData;
	  }
	| {
			type: MainToWorkerMessageType.INIT_WASM;
			data: InitWASMData;
	  }
	| {
			type: MainToWorkerMessageType.CALCULATE_SEGMENT;
			data: CalculateSegmentData;
	  }
	| {
			type: MainToWorkerMessageType.SET_MAX_ITERATIONS;
			data: SetMaxIterationsData;
	  }
	| {
			type: MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS;
			data: SetColorAtMaxIterationsData;
	  };

export type MainToWorkerPostMessage = (message: MainToWorkerMessageData) => void;
