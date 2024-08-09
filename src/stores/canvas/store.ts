import { writable } from 'svelte/store';

export const canvasStore = (() => {
	const { subscribe, update } = writable<{
		canvas: HTMLCanvasElement | null;
		canvasContainer: HTMLDivElement | null;
	}>({
		canvas: null,
		canvasContainer: null
	});

	return {
		subscribe,

		setContainer: (container: HTMLDivElement) =>
			update((state) => {
				state.canvasContainer = container;
				return state;
			}),

		setCanvas: (canvas: HTMLCanvasElement) =>
			update((state) => {
				state.canvas = canvas;
				return state;
			})
	};
})();
