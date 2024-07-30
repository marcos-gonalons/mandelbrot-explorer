import { get } from 'svelte/store';
import Toastify from 'toastify-js';

import { validateENotation } from '$lib/utils/utils';
import { state } from '../../../../stores/mandelbrotState/store';
import { workersManager } from '../../../../stores/workersManager/store';

export const onChange = async ({ target }: Event) => {
	try {
		const value = validateENotation((target as HTMLInputElement).value.toLowerCase(), 30);

		const manager = get(workersManager);
		manager.queue(async () => {
			state.setZoom(value);
			await get(workersManager).setZoom({ zoomLevelAsENotation: get(state).zoomAsENotation });

			get(workersManager).parallelizeCalculation();
		});
	} catch (e: unknown) {
		Toastify({
			text: (e as Error).message,
			position: 'center',
			duration: -1,
			close: true
		}).showToast();
	}
};
