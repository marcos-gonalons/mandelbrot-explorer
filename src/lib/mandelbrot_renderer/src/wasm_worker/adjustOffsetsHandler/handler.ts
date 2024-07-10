import { type AdjustOffsetsMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, type WorkerToMainPostMessage } from '../types/workerToMain';

export function handleAdjustOffsets(data: AdjustOffsetsMessage['data']) {
	const offsets = JSON.parse(self.WASM.functions.adjustOffsets(data.speed, data.angleInDegrees));

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.ADJUST_OFFSETS_FINISHED,
		data: { offsets }
	});
}
