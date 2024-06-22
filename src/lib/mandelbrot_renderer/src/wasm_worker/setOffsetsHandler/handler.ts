import { SetOffsetsData } from '../types/mainToWorker';
import { WorkerToMainMessageType, WorkerToMainPostMessage } from '../types/workerToMain';

export function handleSetOffsets(data: SetOffsetsData) {
	const result = self.WASM.functions.setOffsets(data.xAsENotation, data.yAsENotation);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.SET_OFFSETS_FINISHED,
		data: { error: result }
	});
}
