import { writable } from 'svelte/store';

export const canvasContainer = (() => {
	const { subscribe, update } = writable<HTMLDivElement>();

	return {
		subscribe,

		set: (element: HTMLDivElement) => update(() => element)
	};
})();
