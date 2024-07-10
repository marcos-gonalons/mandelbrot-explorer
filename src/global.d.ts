import type { WorkersManager } from '$lib/mandelbrot_renderer/src/canvas_service/workers_manager/manager';

declare global {
	var workersManager: WorkersManager;
}
