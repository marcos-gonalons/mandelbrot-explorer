import { WorkerToMainMessageType, WorkerToMainPostMessage } from '../types/workerToMain';

export function handleTransferBytesTest() {
	self.WASM.sharedVariables.testArray = new Uint8ClampedArray(1920 * 1080);

	self.WASM.functions.transferBytesTest();

	(self.postMessage as WorkerToMainPostMessage)({
		type: WorkerToMainMessageType.TRANSFER_BYTES_TEST_FINISHED,
		data: {
			pixels: self.WASM.sharedVariables.testArray
		}
	});
}
