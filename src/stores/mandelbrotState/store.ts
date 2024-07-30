import { writable } from 'svelte/store';
import { OperationMode } from '../../lib/mandelbrot_renderer/src/wasm_worker/types/mainToWorker';
import type { State } from './types';

export const defaultState: State = {
	operationMode: OperationMode.FLOAT64,
	maxIterations: 1000,
	zoomAsENotation: '+1.2e-0',
	magnitudeAsENotation: '+1e-1',
	magnitudeDecimals: '1',
	offsetsAsENotation: {
		x: '-4e-1',
		y: '-2e-1'
	},
	colorAtMaxIterations: {
		r: 0,
		g: 0,
		b: 0,
		a: 255
	}
};

export const state = (() => {
	const { subscribe, update } = writable<State>(structuredClone(defaultState));

	return {
		subscribe,

		setMaxIterations: (value: State['maxIterations']) =>
			update((state) => {
				state.maxIterations = value;
				return state;
			}),

		setZoom: (value: State['zoomAsENotation']) =>
			update((state) => {
				state.zoomAsENotation = value;
				return state;
			}),

		setOffsets: (value: State['offsetsAsENotation']) =>
			update((state) => {
				state.offsetsAsENotation = value;
				return state;
			}),

		setColorAtMaxIterations: (value: State['colorAtMaxIterations']) =>
			update((state) => {
				state.colorAtMaxIterations = value;
				return state;
			})
	};
})();
