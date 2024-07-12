// @ts-ignore
import Line = require('progressbar.js/line');
import { createDragHandler } from './dragHandler';
import { createKeypressHandler } from './keypressHandler';
import { createMouseCoordinatesHandler } from './mouseCoordinatesHandler';
import { createWorkersManager } from './workers_manager/manager';
import { createZoomHandler } from './zoomHandler';

export const init = async (
	canvasContainer: HTMLDivElement,
	canvas: HTMLCanvasElement,
	progressBar: Line
) => {
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	let imageData: ImageData;
	let resizeInterval: ReturnType<typeof setInterval> | null;
	let lastResizeAt: number;

	const { workersManager } = initHandlers();

	initEventListeners();

	initCanvas();

	try {
		await workersManager.init();

		////////////////////////////////////////////////
		(window as any).workersManager = workersManager;
		////////////////////////////////////////////////
	} catch (e) {
		alert('Sorry, an error occurred :( - Please try with another browser');
	}

	function initHandlers() {
		const workersManager = createWorkersManager(
			() => imageData,
			() => canvas,
			() => canvasContainer,
			() => ctx,
			initCanvas,
			progressBar
		);

		const mouseCoordinatesHandler = createMouseCoordinatesHandler(canvas);
		const keypressHandler = createKeypressHandler();

		const zoomHandler = createZoomHandler(
			() => imageData,
			mouseCoordinatesHandler,
			workersManager,
			keypressHandler
		);

		const dragHandler = createDragHandler(
			() => canvas,
			zoomHandler,
			mouseCoordinatesHandler,
			workersManager,
			keypressHandler
		);

		return {
			workersManager,
			mouseCoordinatesHandler,
			zoomHandler,
			dragHandler
		};
	}

	function initEventListeners(): void {
		const onResize = () => {
			lastResizeAt = new Date().getTime();

			if (resizeInterval) return;

			resizeInterval = setInterval(() => {
				if (workersManager.isCalculating()) {
					return;
				}

				const now = new Date().getTime();

				if (now - lastResizeAt > 350) {
					clearInterval(resizeInterval as ReturnType<typeof setInterval>);
					resizeInterval = null;
					initCanvas();
					workersManager.parallelizeCalculation();
				}
			}, 50);
		};
		addEventListener('resize', onResize);
	}

	function initCanvas(): void {
		canvas.height = canvasContainer.clientHeight;
		canvas.width = canvasContainer.clientWidth;

		imageData = ctx.createImageData(canvas.width, canvas.height);

		ctx.putImageData(imageData, 0, 0);
	}
};
