import { type CalculateSegmentMessage } from '../types/mainToWorker';
import { WorkerToMainMessageType, type WorkerToMainPostMessage } from '../types/workerToMain';

export function handleCalculateSegment(data: CalculateSegmentMessage['data']) {
	self.WASM.sharedVariables.segmentData = new Uint8ClampedArray(data.segmentLength);

	self.WASM.callbacks.progress = (progress: number) => {
		(self.postMessage as WorkerToMainPostMessage)({
			type: WorkerToMainMessageType.CALCULATION_PROGRESS,
			data: { progress }
		});
	};

	self.WASM.functions.calculateSegment(
		data.canvasSize.width,
		data.canvasSize.height,
		data.segmentLength,
		data.startsAt,
		data.resolution
	);

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.CALCULATE_SEGMENT_FINISHED,
		data: {
			segment: self.WASM.sharedVariables.segmentData,
			startsAt: data.startsAt,
			canvasSize: data.canvasSize,
			resolution: data.resolution
		}
	});
}
