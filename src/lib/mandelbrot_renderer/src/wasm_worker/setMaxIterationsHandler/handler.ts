import { SetMaxIterationsData } from '../types/mainToWorker';
import { WorkerToMainMessageType, WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetMaxIterations({ value: iterations }: SetMaxIterationsData) {
	self.WASM.functions.setMaxIterations(iterations);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_MAX_ITERATIONS_FINISHED
	});
}
