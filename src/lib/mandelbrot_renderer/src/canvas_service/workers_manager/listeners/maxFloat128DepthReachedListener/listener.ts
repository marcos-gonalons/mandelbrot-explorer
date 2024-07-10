import * as Toastify from 'toastify-js';

// @ts-ignore
import { getTranslation } from 'app-translations';

let notificationsAmount = 0;

export function maxFloat128DepthReachedListener(workers: Worker[]): void {
	notificationsAmount++;
	if (notificationsAmount < workers.length) return;
	notificationsAmount = 0;

	Toastify({
		text: getTranslation('maxFloat128DepthReached'),
		position: 'center',
		duration: -1,
		close: true
	}).showToast();
}
