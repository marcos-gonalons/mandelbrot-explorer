import Toastify from 'toastify-js';
import { getTranslation } from '../../../../../../../translations';

let notificationsAmount = 0;

export function maxFloat64DepthReachedListener(
	canvasContainer: HTMLDivElement,
	canvas: HTMLCanvasElement,
	workers: (Worker | null)[],
	initCanvas: () => void
): void {
	notificationsAmount++;
	if (notificationsAmount < workers.length) return;
	notificationsAmount = 0;

	canvasContainer.style.width = '40%';
	canvasContainer.style.height = '50%';
	canvasContainer.style.top = '25%';
	canvasContainer.style.left = '30%';
	canvasContainer.style.borderRadius = '20px';
	canvas.style.borderRadius = '20px';

	Toastify({
		text: getTranslation('maxFloat64DepthReached'),
		position: 'center',
		duration: -1,
		close: true
	}).showToast();

	initCanvas();
}
