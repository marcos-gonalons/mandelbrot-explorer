import type { WorkersManager } from '$lib/mandelbrot_renderer/src/canvas_service/workers_manager/manager';
import { writable } from 'svelte/store';

export const workersManager = (() => {
	const { subscribe, update } = writable<WorkersManager>();

	return {
		subscribe,

		set: (manager: WorkersManager) => update(() => manager)
	};
})();
