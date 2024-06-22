import { handleCalculateSegment } from './calculateSegmentHandler/handler';
import { handleInitWasm } from './initWasmHandler/handler';
import { handleAdjustOffsets } from './adjustOffsetsHandler/handler';
import { handleAdjustZoom } from './adjustZoomHandler/handler';
import { MainToWorkerMessageData, MainToWorkerMessageType } from './types/mainToWorker';
import { handleSetMaxIterations } from './setMaxIterationsHandler/handler';
import { handleSetZoom } from './setZoomHandler/handler';
import { handleSetOffsets } from './setOffsetsHandler/handler';

export const handle = async ({ data: message }: MessageEvent<MainToWorkerMessageData>) => {
	switch (message.type) {
		case MainToWorkerMessageType.INIT_WASM:
			handleInitWasm(message.data);
			break;
		case MainToWorkerMessageType.ADJUST_OFFSETS:
			handleAdjustOffsets(message.data);
			break;
		case MainToWorkerMessageType.SET_OFFSETS:
			handleSetOffsets(message.data);
			break;
		case MainToWorkerMessageType.ADJUST_ZOOM:
			handleAdjustZoom(message.data);
			break;
		case MainToWorkerMessageType.SET_ZOOM:
			handleSetZoom(message.data);
			break;
		case MainToWorkerMessageType.CALCULATE_SEGMENT:
			handleCalculateSegment(message.data);
			break;
		case MainToWorkerMessageType.SET_MAX_ITERATIONS:
			handleSetMaxIterations(message.data);
			break;
	}
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
		adjustOffsets: placeholder,
		setOffsets: placeholder,
		adjustZoom: placeholder,
		setZoom: placeholder,
		calculateSegment: placeholder
	}
};
