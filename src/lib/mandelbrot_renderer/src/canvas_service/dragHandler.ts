import { AdjustOffsetsData } from '../wasm_worker/types/mainToWorker';
import { LOW_RESOLUTION } from './constants';
import { KeypressHandler } from './keypressHandler';
import { MouseCoordinatesHandler } from './mouseCoordinatesHandler';
import { WorkersManager } from './workers_manager/manager';
import { ZoomHandler } from './zoomHandler';

export const createDragHandler = (
	getCanvas: () => HTMLCanvasElement,
	zoomHandler: ZoomHandler,
	mouseCoordinatesHandler: MouseCoordinatesHandler,
	workersManager: WorkersManager,
	keypressHandler: KeypressHandler
) => {
	let coordinatesAtStartOfDragging: number[] = [0, 0];
	let isDraggingCanvas: boolean = false;
	let draggingInterval: ReturnType<typeof setInterval>;

	addEventListener('mousedown', onMouseDown);
	addEventListener('mouseup', onMouseUp);
	addEventListener('mousemove', onMouseMove);

	function onMouseDown(event: MouseEvent) {
		if (!(event.target instanceof HTMLCanvasElement)) {
			return;
		}

		isDraggingCanvas = true;
		getCanvas().style.cursor = 'grabbing';
		coordinatesAtStartOfDragging = mouseCoordinatesHandler.getCoordinates();
	}

	function onMouseUp(event: MouseEvent) {
		if (!isDraggingCanvas || !(event.target instanceof HTMLCanvasElement)) {
			return;
		}
		stopDragging();
	}

	function onMouseMove(event: MouseEvent): void {
		if (!isDraggingCanvas || zoomHandler.isScrolling()) {
			return;
		}

		if (!(event.target instanceof HTMLCanvasElement)) {
			stopDragging();
			return;
		}

		updateOffsets();

		workersManager.parallelizeCalculation(LOW_RESOLUTION);
	}

	function stopDragging() {
		isDraggingCanvas = false;
		getCanvas().style.cursor = 'grab';
		coordinatesAtStartOfDragging = mouseCoordinatesHandler.getCoordinates();

		if (draggingInterval) return;

		draggingInterval = setInterval(() => {
			if (workersManager.isCalculating()) {
				return;
			}

			clearInterval(draggingInterval);
			draggingInterval = null;

			workersManager.parallelizeCalculation();
		}, 10);
	}

	function updateOffsets(): void {
		const mouseCoordinates = mouseCoordinatesHandler.getCoordinates();

		let speed = getDistanceBetweenCoordinates(coordinatesAtStartOfDragging, mouseCoordinates) / 10;

		speed *= 2;
		if (keypressHandler.isPressingControl()) {
			speed /= 2;
		}
		if (keypressHandler.isPressingShift()) {
			speed *= 5;
		}

		const data: AdjustOffsetsData = {
			speed,
			angleInDegrees: getAngleBetweenCoordinatesInDegrees(
				coordinatesAtStartOfDragging,
				mouseCoordinates
			)
		};

		workersManager.adjustOffsets(data);
	}

	const getDistanceBetweenCoordinates = (c1: number[], c2: number[]): number => {
		return Math.sqrt(Math.pow(c2[0] - c1[0], 2) + Math.pow(c2[1] - c1[1], 2));
	};

	const getAngleBetweenCoordinatesInDegrees = (c1: number[], c2: number[]): number => {
		return (Math.atan2(c1[1] - c2[1], c2[0] - c1[0]) * (180 / Math.PI) + 360) % 360;
	};
};
