import { type SetOffsetsMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, type WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetOffsets(data: SetOffsetsMessage['data']) {
	const result = self.WASM.functions.setOffsets(data.xAsENotation, data.yAsENotation);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_OFFSETS_FINISHED,
		data: { error: result }
	});
}
