import { type AdjustZoomMessage } from '../wasm_worker/types/mainToWorker';
import { type KeypressHandler } from './keypressHandler';
import { type MouseCoordinatesHandler } from './mouseCoordinatesHandler';
import { type WorkersManager } from './workers_manager/manager';

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
	let scrollingInterval: ReturnType<typeof setInterval> | null;
	let lastScrollAt: number;

	addEventListener('wheel', onMouseWheel, { passive: false });

	async function onMouseWheel(event: WheelEvent): Promise<void> {
		disableBrowserZooming(event);

		if (!(event.target instanceof HTMLCanvasElement)) {
			return;
		}

		lastScrollAt = new Date().getTime();
		const mouseCoordinates = mouseCoordinatesHandler.getCoordinates();

		const imageData = getImageData();
		const data: AdjustZoomMessage['data'] = {
			type: event.deltaY < 0,
			speed: getZoomSpeed(),
			strategy: ZoomingStrategy.CENTERED,
			mouseCoordinates,
			canvasSize: { width: imageData.width, height: imageData.height }
		};
		await workersManager.adjustZoom(data);

		workersManager.parallelizeCalculation(true);

		if (scrollingInterval) return;

		scrollingInterval = setInterval(() => {
			if (workersManager.isCalculating()) {
				return;
			}

			const now = new Date().getTime();

			if (now - lastScrollAt > 350) {
				clearInterval(scrollingInterval as ReturnType<typeof setInterval>);
				scrollingInterval = null;
				workersManager.parallelizeCalculation();
			}
		}, 50);
	}

	function getZoomSpeed(): number {
		if (keypressHandler.isPressingShift()) return 6;
		if (keypressHandler.isPressingControl()) return 1;
		return 2;
	}

	function disableBrowserZooming(event: WheelEvent): void {
		if (keypressHandler.isPressingControl()) {
			event.preventDefault();
		}
	}

	return {
		onMouseWheel,
		isScrolling: () => Boolean(scrollingInterval)
	};
};
