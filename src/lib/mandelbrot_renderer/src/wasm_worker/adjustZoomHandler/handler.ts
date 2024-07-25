import { type AdjustZoomMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, type WorkerToMainPostMessage } from '../types/workerToMain';

export function handleAdjustZoom(data: AdjustZoomMessage['data']) {
	const postMessage = self.postMessage as WorkerToMainPostMessage;

	self.WASM.callbacks.maxFloat64DepthReached = () => {
		postMessage({
			type: WorkerToMainMessageType.MAX_FLOAT64_DEPTH_REACHED
		});
	};
	self.WASM.callbacks.maxFloat128DepthReached = () => {
		postMessage({
			type: WorkerToMainMessageType.MAX_FLOAT128_DEPTH_REACHED
		});
	};

	const result = JSON.parse(
		self.WASM.functions.adjustZoom(
			data.type,
			data.speed,
			data.strategy,
			data.mouseCoordinates[0],
			data.mouseCoordinates[1],
			data.canvasSize.width,
			data.canvasSize.height
		)
	);

	postMessage({
		type: WorkerToMainMessageType.ADJUST_ZOOM_FINISHED,
		data: { ...result }
	});
}
