import {
	type InitWASMErrorMessage,
	type WorkerToMainMessage,
	WorkerToMainMessageType
} from '../../../../wasm_worker/types/workerToMain';

let totalSuccesses: number = 0;
let totalErrors: number = 0;

export function initWasmListener(
	{ data: message }: MessageEvent<WorkerToMainMessage>,
	workers: (Worker | null)[],
	onWorkersInitialized: (workers: (Worker | null)[]) => void,
	onFailure: (e: Error) => void
): void {
	switch (message.type) {
		case WorkerToMainMessageType.INIT_WASM_ERROR:
			onInitWASMError((message as InitWASMErrorMessage).data);
			break;
		case WorkerToMainMessageType.INIT_WASM_FINISHED:
			onInitWASMFinished();
			break;
	}

	function onInitWASMError({ workerIndex }: InitWASMErrorMessage['data']): void {
		totalErrors++;
		(workers[workerIndex] as Worker).terminate();
		workers[workerIndex] = null;

		if (totalErrors === workers.length) {
			onFailure(new Error('Unable to initialize any worker'));
			return;
		}
		if (totalErrors + totalSuccesses === workers.length) {
			onWorkersInitialized(workers);
		}
	}

	function onInitWASMFinished(): void {
		totalSuccesses++;

		if (totalErrors + totalSuccesses === workers.length) {
			onWorkersInitialized(workers);
		}
	}
}
