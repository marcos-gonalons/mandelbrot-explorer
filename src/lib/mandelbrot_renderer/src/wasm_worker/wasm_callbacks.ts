import { WorkerToMainMessageType, type WorkerToMainPostMessage } from './types/workerToMain';

export const setupCallbacks = () => {
	self.WASM.callbacks.maxFloat64DepthReached = () => {
		postMessage({
			type: WorkerToMainMessageType.MAX_FLOAT64_DEPTH_REACHED
		});
	};

	self.WASM.callbacks.maxFloat128DepthReached = () => {
		postMessage({
			type: WorkerToMainMessageType.MAX_FLOAT128_DEPTH_REACHED
		});
	};

	self.WASM.callbacks.progress = (progress: number) => {
		(self.postMessage as WorkerToMainPostMessage)({
			type: WorkerToMainMessageType.CALCULATION_PROGRESS,
			data: { progress }
		});
	};
};
