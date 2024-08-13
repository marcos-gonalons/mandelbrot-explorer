import { type SetSColorChangeFrequencyMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, type WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetColorChangeFrequency({ value }: SetSColorChangeFrequencyMessage['data']) {
	self.WASM.functions.setColorChangeFrequency(value);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_COLOR_CHANGE_FREQUENCY_FINISHED
	});
}
