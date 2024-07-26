import { get } from 'svelte/store';
import Toastify from 'toastify-js';

import { validateENotation } from '$lib/utils/utils';
import { state } from '../../../../stores/state/store';
import { workersManager } from '../../../../stores/workersManager/store';

export const onChange = async (value: string, offset: 'x' | 'y') => {
	const offsets = structuredClone(get(state).offsetsAsENotation);

	try {
		offsets[offset] = validateENotation(value.toLowerCase(), 100);
		state.setOffsets(offsets);

		await get(workersManager).setOffsets({
			xAsENotation: offsets.x,
			yAsENotation: offsets.y
		});

		get(workersManager).parallelizeCalculation();
	} catch (e: unknown) {
		Toastify({
			text: (e as Error).message,
			position: 'center',
			duration: -1,
			close: true
		}).showToast();
	}
};
