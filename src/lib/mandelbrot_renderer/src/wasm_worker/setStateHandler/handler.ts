import { SetStateData } from '../types/mainToWorker';
import { WorkerToMainMessageType, WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetState(data: SetStateData) {
	const result = self.WASM.functions.setState(JSON.stringify(data.state));

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_STATE_FINISHED,
		data: { error: result }
	});
}
