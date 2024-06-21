import { SetZoomData } from '../types/mainToWorker';
import { WorkerToMainMessageType, WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetZoom(data: SetZoomData) {
	const result = self.WASM.functions.setZoom(data.zoomLevelAsENotation);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_ZOOM_FINISHED,
		data: { error: result }
	});
}
