import { type SetColorAtMaxIterationsMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, type WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetColorAtMaxIterations({
	color: { r, g, b, a }
}: SetColorAtMaxIterationsMessage['data']) {
	self.WASM.functions.setColorAtMaxIterations(r, g, b, a);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_COLOR_AT_MAX_ITERATIONS_FINISHED
	});
}
