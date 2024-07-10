import * as Toastify from 'toastify-js';

// @ts-ignore
import { getTranslation } from 'app-translations';

let notificationsAmount = 0;

export function maxFloat64DepthReachedListener(
	canvasContainer: HTMLDivElement,
	workers: Worker[],
	initCanvas: () => void
): void {
	notificationsAmount++;
	if (notificationsAmount < workers.length) return;
	notificationsAmount = 0;

	canvasContainer.style.width = '40%';
	canvasContainer.style.height = '50%';
	canvasContainer.style.top = '25%';
	canvasContainer.style.left = '30%';

	Toastify({
		text: getTranslation('maxFloat64DepthReached'),
		position: 'center',
		duration: -1,
		close: true
	}).showToast();

	initCanvas();
}
