import { AdjustZoomData } from '../types/mainToWorker';
import { WorkerToMainMessageType, WorkerToMainPostMessage } from '../types/workerToMain';

export function handleAdjustZoom(data: AdjustZoomData) {
	self.WASM.callbacks.maxFloat64DepthReached = () => {
		// todo: display a toast or something saying that from now on, the rendering will be a lot slower.
		console.log('Max float64 depth reached');
	};
	self.WASM.callbacks.maxFloat128DepthReached = () => {
		// todo: display a toast or something saying that it's not possible to go any deeper.
		console.log('Max float128 depth reached');
	};

	self.WASM.functions.adjustZoom(
		data.type,
		data.speed,
		data.strategy,
		data.mouseCoordinates[0],
		data.mouseCoordinates[1],
		data.canvasSize.width,
		data.canvasSize.height
	);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.ADJUST_ZOOM_FINISHED
	});
}
