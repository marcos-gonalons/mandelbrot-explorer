import Line = require('progressbar.js/line');
import { createDragHandler } from './dragHandler';
import { createMouseCoordinatesHandler } from './mouseCoordinatesHandler';
import { WorkerFunction, WorkersManager, createWorkersManager } from './workers_manager/manager';
import { createZoomHandler } from './zoomHandler';
import { createKeypressHandler } from './keypressHandler';

export const init = async (canvas: HTMLCanvasElement, progressBar: Line) => {
	const ctx = canvas.getContext('2d');
	let imageData: ImageData;

	const { workersManager } = initHandlers();

	initEventListeners();

	initCanvas();

	try {
		await workersManager.init();
		workersManager.call(WorkerFunction.CALCULATE);
	} catch (e) {
		// TODO: Some toast or something else instead of an alert
		alert('Sorry, an error occurred :(');
	}

	function initHandlers() {
		const workersManager = createWorkersManager(
			() => imageData,
			() => canvas,
			() => ctx,
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
			initCanvas();
			setTimeout(() => workersManager.call(WorkerFunction.CALCULATE), 100);
		};
		addEventListener('resize', onResize);
	}

	function initCanvas(): void {
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		imageData = ctx.createImageData(canvas.width, canvas.height);

		ctx.putImageData(imageData, 0, 0);
	}
};
