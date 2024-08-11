import { type SetSaturationMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, type WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetSaturation({ value }: SetSaturationMessage['data']) {
	self.WASM.functions.setSaturation(value);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_SATURATION_FINISHED
	});
}
