import { OperationMode } from '$lib/mandelbrot_renderer/src/wasm_worker/types/mainToWorker';
import { writable } from 'svelte/store';
import type { State } from './types';

export const stateStore = (() => {
	const { subscribe, update } = writable<State>({
		operationMode: OperationMode.FLOAT64,
		maxIterations: 2000,
		zoomAsENotation: '+1.2e-0',
		magnitudeAsENotation: '1e-1',
		magnitudeDecimals: '1',
		offsetsAsENotation: {
			x: '-2e-1',
			y: '-2e-1'
		},
		colorAtMaxIterations: {
			R: 0,
			G: 0,
			B: 0,
			A: 255
		}
	});

	return {
		subscribe,

		setMaxIterations: (value: State['maxIterations']) =>
			update((state) => {
				state.maxIterations = value;
				return state;
			})
	};
})();