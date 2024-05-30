import { AdjustZoomData } from '../wasm_worker/types/mainToWorker';
import { KeypressHandler } from './keypressHandler';
import { MouseCoordinatesHandler } from './mouseCoordinatesHandler';
import { WorkerFunction, WorkersManager } from './workers_manager/manager';

export type ZoomHandler = ReturnType<typeof createZoomHandler>;
export enum ZoomingStrategy {
	CENTERED = 1,
	CURSOR = 2
}

export const createZoomHandler = (
	getImageData: () => ImageData,
	mouseCoordinatesHandler: MouseCoordinatesHandler,
	workersManager: WorkersManager,
	keypressHandler: KeypressHandler
) => {
	let scrollingInterval: ReturnType<typeof setInterval>;
	let lastScrollAt: number;

	addEventListener('wheel', onMouseWheel, { passive: false });

	function onMouseWheel(event: WheelEvent): void {
		event.preventDefault();

		lastScrollAt = new Date().getTime();
		const mouseCoordinates = mouseCoordinatesHandler.getCoordinates();

		const imageData = getImageData();
		const data: AdjustZoomData = {
			type: event.deltaY < 0,
			speed: getZoomSpeed(),
			strategy: ZoomingStrategy.CENTERED,
			mouseCoordinates,
			canvasSize: { width: imageData.width, height: imageData.height }
		};
		workersManager.call(WorkerFunction.ADJUST_ZOOM, data);

		workersManager.call(WorkerFunction.CALCULATE, 4);

		if (scrollingInterval) return;

		scrollingInterval = setInterval(() => {
			if (workersManager.isCalculating()) {
				return;
			}

			const now = new Date().getTime();

			if (now - lastScrollAt > 350) {
				clearInterval(scrollingInterval);
				scrollingInterval = null;
				workersManager.call(WorkerFunction.CALCULATE);
			}
		}, 50);
	}

	function getZoomSpeed(): number {
		if (keypressHandler.isPressingShift()) return 6;
		if (keypressHandler.isPressingControl()) return 1;
		return 2;
	}

	return {
		onMouseWheel,
		isScrolling: () => Boolean(scrollingInterval)
	};
};