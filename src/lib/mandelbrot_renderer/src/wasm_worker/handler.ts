import { handleAdjustOffsets } from './adjustOffsetsHandler/handler';
import { handleAdjustZoom } from './adjustZoomHandler/handler';
import { handleCalculateSegment } from './calculateSegmentHandler/handler';
import { handleInitWasm } from './initWasmHandler/handler';
import { handleSetColorAtMaxIterations } from './setColorAtMaxIterationsHandler/handler';
import { handleSetMaxIterations } from './setMaxIterationsHandler/handler';
import { handleSetOffsets } from './setOffsetsHandler/handler';
import { handleSetZoom } from './setZoomHandler/handler';
import { MainToWorkerMessageData, MainToWorkerMessageType } from './types/mainToWorker';

const typeMap = new Map();

typeMap.set(MainToWorkerMessageType.INIT_WASM, handleInitWasm);
typeMap.set(MainToWorkerMessageType.ADJUST_OFFSETS, handleAdjustOffsets);
typeMap.set(MainToWorkerMessageType.SET_OFFSETS, handleSetOffsets);
typeMap.set(MainToWorkerMessageType.ADJUST_ZOOM, handleAdjustZoom);
typeMap.set(MainToWorkerMessageType.SET_ZOOM, handleSetZoom);
typeMap.set(MainToWorkerMessageType.CALCULATE_SEGMENT, handleCalculateSegment);
typeMap.set(MainToWorkerMessageType.SET_MAX_ITERATIONS, handleSetMaxIterations);
typeMap.set(MainToWorkerMessageType.SET_COLOR_AT_MAX_ITERATIONS, handleSetColorAtMaxIterations);

export const handle = async ({ data: message }: MessageEvent<MainToWorkerMessageData>) => {
	typeMap.get(message.type)(message.data);
};

const placeholder = (...args: any): any => console.error('WASM not loaded');
self.WASM = {
	sharedVariables: {
		segmentData: new Uint8ClampedArray()
	},
	callbacks: {
		progress: placeholder,
		maxFloat64DepthReached: placeholder,
		maxFloat128DepthReached: placeholder
	},
	functions: {
		setMaxIterations: placeholder,
		setColorAtMaxIterations: placeholder,
		adjustOffsets: placeholder,
		setOffsets: placeholder,
		adjustZoom: placeholder,
		setZoom: placeholder,
		calculateSegment: placeholder
	}
};
