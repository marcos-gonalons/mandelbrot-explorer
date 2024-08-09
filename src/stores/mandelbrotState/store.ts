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
	},
	colorScheme: [
		// Second color dictactes the main color at default zoom

		// CHARTREUSE
		{ r: 127, g: 255, b: 0, a: 255 },
		// DODGER_BLUE
		{ r: 0, g: 127, b: 255, a: 255 },
		// LIGHT_SLATE_BLUE
		{ r: 127, g: 127, b: 255, a: 255 },
		// WHITE
		{ r: 255, g: 255, b: 255, a: 255 },
		// LIGHT_CORAL
		{ r: 255, g: 127, b: 127, a: 255 },
		// CANARY
		{ r: 255, g: 255, b: 127, a: 255 },
		// LIGHT_GREEN
		{ r: 127, g: 255, b: 127, a: 255 },
		// ELECTRIC_BLUE
		{ r: 127, g: 255, b: 255, a: 255 },
		// ELECTRIC_INDIGO
		{ r: 127, g: 0, b: 255, a: 255 },
		// SPRING_GREEN
		{ r: 0, g: 255, b: 127, a: 255 },
		// BLUE
		{ r: 0, g: 0, b: 255, a: 255 },
		// FUCHSIA_PINK
		{ r: 255, g: 127, b: 255, a: 255 },
		// DARK_ORANGE
		{ r: 255, g: 127, b: 0, a: 255 },
		// DEEP_PINK
		{ r: 255, g: 0, b: 127, a: 255 },
		// FUCHSIA
		{ r: 255, g: 0, b: 255, a: 255 },
		// AQUA
		{ r: 0, g: 255, b: 255, a: 255 },
		// RED
		{ r: 255, g: 0, b: 0, a: 255 },
		// LIME
		{ r: 0, g: 255, b: 0, a: 255 },
		// YELLOW
		{ r: 255, g: 255, b: 0, a: 255 }
	]
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
