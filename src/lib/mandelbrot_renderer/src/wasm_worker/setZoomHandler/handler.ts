import { type SetZoomMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, type WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetZoom(data: SetZoomMessage['data']) {
	self.WASM.callbacks.maxFloat64DepthReached = () => {
		postMessage({
			type: WorkerToMainMessageType.MAX_FLOAT64_DEPTH_REACHED
		});
	};

	const result = self.WASM.functions.setZoom(data.zoomLevelAsENotation);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_ZOOM_FINISHED,
		data: { error: result }
	});
}
