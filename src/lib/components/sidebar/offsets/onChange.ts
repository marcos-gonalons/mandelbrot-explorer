import { get } from 'svelte/store';

import { state } from '../../../../stores/state/store';
import { workersManager } from '../../../../stores/workersManager/store';

export const onChange = async (value: string, offset: 'x' | 'y') => {
	// todo: validate and show toast for invalid values
	const offsets = structuredClone(get(state).offsetsAsENotation);

	offsets[offset] = value;
	state.setOffsets(offsets);

	// todo: make sure value is valid e notation number
	await get(workersManager).setOffsets({
		xAsENotation: offsets.x,
		yAsENotation: offsets.y
	});

	get(workersManager).parallelizeCalculation();
};
