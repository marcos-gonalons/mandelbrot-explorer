import * as Toastify from 'toastify-js';

// @ts-ignore
import { getTranslation } from '../../../../../../../translations';

let notificationsAmount = 0;

export function maxFloat128DepthReachedListener(workers: (Worker | null)[]): void {
	notificationsAmount++;
	if (notificationsAmount < workers.length) return;
	notificationsAmount = 0;

	// @ts-ignore
	Toastify({
		text: getTranslation('maxFloat128DepthReached'),
		position: 'center',
		duration: -1,
		close: true
	}).showToast();
}
