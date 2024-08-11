import { type SetBrightnessMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, type WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetBrightness({ value }: SetBrightnessMessage['data']) {
	self.WASM.functions.setBrightness(value);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_BRIGHTNESS_FINISHED
	});
}
