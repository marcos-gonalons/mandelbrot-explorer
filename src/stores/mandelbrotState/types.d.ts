import type { SetStateMessage } from '$lib/mandelbrot_renderer/src/wasm_worker/types/mainToWorker';

export type State = SetStateMessage['data']['state'];
