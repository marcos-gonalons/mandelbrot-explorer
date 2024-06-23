import { SetZoomMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetZoom(data: SetZoomMessage['data']) {
	const result = self.WASM.functions.setZoom(data.zoomLevelAsENotation);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_ZOOM_FINISHED,
		data: { error: result }
	});
}
