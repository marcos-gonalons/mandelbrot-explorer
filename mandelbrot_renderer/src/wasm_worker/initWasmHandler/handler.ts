import { InitWASMData } from '../types/mainToWorker';
import { WorkerToMainMessageType, WorkerToMainPostMessage } from '../types/workerToMain';

export async function handleInitWasm({ workerIndex, wasmURL }: InitWASMData) {
	try {
		const go = new Go();
		let result: WebAssembly.WebAssemblyInstantiatedSource;

		const instantiatePromise = WebAssembly.instantiateStreaming(fetch(wasmURL), go.importObject);

		// I have to resort to Promise.race for firefox because a normal try catch
		// surrounding await WebAssembly.instantiate doesn't work on firefox (promise never resolves nor rejects)
		await Promise.race([
			instantiatePromise,
			new Promise<void>((resolve, reject) =>
				setTimeout(() => {
					result ? resolve() : reject(new Error('Unable to instantiate WASM'));
				}, 1000)
			)
		]);

		result = await instantiatePromise;
		go.run(result.instance);

		(self.postMessage as WorkerToMainPostMessage)({
			type: WorkerToMainMessageType.INIT_WASM_FINISHED
		});
	} catch (err) {
		(self.postMessage as WorkerToMainPostMessage)({
			type: WorkerToMainMessageType.INIT_WASM_ERROR,
			data: { workerIndex }
		});
	}
}
