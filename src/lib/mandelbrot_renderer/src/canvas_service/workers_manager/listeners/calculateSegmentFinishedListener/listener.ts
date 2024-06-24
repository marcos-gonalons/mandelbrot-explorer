import Line = require('progressbar.js/line');
import { Size } from '../../../../types';
import { CalculateSegmentFinishedMessage } from '../../../../wasm_worker/types/workerToMain';

let finishedSegments: CalculateSegmentFinishedMessage['data'][] = [];

export function calculateSegmentFinishedListener(
	data: CalculateSegmentFinishedMessage['data'],
	progressBar: Line,
	workers: Worker[],
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D
): void {
	finishedSegments.push(data);
	if (finishedSegments.length < workers.length) return;

	if (data.resolution <= 1) {
		progressBar.animate(1, { duration: 200 }, () => setTimeout(() => progressBar.set(0), 100));
	}

	renderMandelbrot(data.canvasSize);

	finishedSegments = [];

	function renderMandelbrot({ width, height }: Size) {
		const visibleCanvas = canvas;
		const visibleContext = ctx;

		const imageData = visibleContext.createImageData(width, height);

		finishedSegments.forEach((v) =>
			v.segment.forEach(
				(pixelData: number, i: number) => (imageData.data[i + v.startsAt] = pixelData)
			)
		);

		const invisibleCanvas = document.createElement('canvas');
		const invisibleCtx = invisibleCanvas.getContext('2d');
		invisibleCanvas.width = imageData.width;
		invisibleCanvas.height = imageData.height;

		invisibleCtx.putImageData(imageData, 0, 0);

		const invisibleCanvasImage = new Image();
		invisibleCanvasImage.src = invisibleCanvas.toDataURL();

		invisibleCanvasImage.onload = () => {
			visibleContext.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
			visibleContext.drawImage(
				invisibleCanvasImage,
				0,
				0,
				visibleCanvas.width,
				visibleCanvas.height
			);
		};

		invisibleCanvas.remove();
		invisibleCanvasImage.remove();
	}
}
