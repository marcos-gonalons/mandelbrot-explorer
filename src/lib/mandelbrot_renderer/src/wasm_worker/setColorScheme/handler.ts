import { type SetColorSchemeMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, type WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetColorScheme({ scheme }: SetColorSchemeMessage['data']) {
	self.WASM.functions.setColorScheme(JSON.stringify(scheme));

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_COLOR_SCHEME_FINISHED
	});
}
