import { AdjustOffsetsData } from '../types/mainToWorker';
import { WorkerToMainMessageType, WorkerToMainPostMessage } from '../types/workerToMain';

export function handleAdjustOffsets(data: AdjustOffsetsData) {
	self.WASM.functions.adjustOffsets(data.speed, data.angleInDegrees);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.ADJUST_OFFSETS_FINISHED
	});
}
