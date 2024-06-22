import { SetColorAtMaxIterationsData } from '../types/mainToWorker';
import { WorkerToMainMessageType, WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetColorAtMaxIterations({
	color: { R, G, B, A }
}: SetColorAtMaxIterationsData) {
	self.WASM.functions.setColorAtMaxIterations(R, G, B, A);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_COLOR_AT_MAX_ITERATIONS_FINISHED
	});
}
