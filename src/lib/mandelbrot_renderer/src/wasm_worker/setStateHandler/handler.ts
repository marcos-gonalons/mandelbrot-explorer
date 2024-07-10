import { type SetStateMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, type WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetState(data: SetStateMessage['data']) {
	const result = self.WASM.functions.setState(JSON.stringify(data.state));

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_STATE_FINISHED,
		data: { error: result }
	});
}
