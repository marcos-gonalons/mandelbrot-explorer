import { handleCalculateSegment } from './calculateSegmentHandler/handler';
import { handleInitWasm } from './initWasmHandler/handler';
import { handleTransferBytesTest } from './transferBytesTestHandler/handler';
import { handleAdjustOffsets } from './adjustOffsetsHandler/handler';
import { handleAdjustZoom } from './adjustZoomHandler/handler';
import { MainToWorkerMessageData, MainToWorkerMessageType } from './types/mainToWorker';

export const handle = async ({ data: message }: MessageEvent<MainToWorkerMessageData>) => {
	switch (message.type) {
		case MainToWorkerMessageType.INIT_WASM:
			handleInitWasm(message.data);
			break;
		case MainToWorkerMessageType.TRANSFER_BYTES_TEST:
			handleTransferBytesTest();
			break;
		case MainToWorkerMessageType.ADJUST_OFFSETS:
			handleAdjustOffsets(message.data);
			break;
		case MainToWorkerMessageType.ADJUST_ZOOM:
			handleAdjustZoom(message.data);
			break;
		case MainToWorkerMessageType.CALCULATE_SEGMENT:
			handleCalculateSegment(message.data);
			break;
	}
};

const placeholder = (...args: any) => console.error('WASM not loaded');
self.WASM = {
	sharedVariables: {
		testArray: new Uint8ClampedArray(),
		segmentData: new Uint8ClampedArray()
	},
	callbacks: {
		progress: placeholder,
		maxFloat64DepthReached: placeholder
	},
	functions: {
		transferBytesTest: placeholder,
		adjustOffsets: placeholder,
		adjustZoom: placeholder,
		calculateSegment: placeholder
	}
};
