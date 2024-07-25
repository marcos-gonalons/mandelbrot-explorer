import { get } from 'svelte/store';

import { state } from '../../../../stores/state/store';
import { workersManager } from '../../../../stores/workersManager/store';

export const onChange = async ({ target }: Event) => {
	const value = (target as HTMLInputElement).value;

	// todo: validate and show toast for invalid values
	// ONLY E NOTATION STRINGS WITH E- ARE VALID. IF IT'S E+ THEN IT'S NOT VALID. SHOW A TOAST WITH THAT.
	// BUT IF IT'S E+0 OR E+00 OR E+000 WHATEVER 0, THEN I CAN JUST TRANSFORM THAT TO E- AND SEND IT TO WASM.
	// Same when setting the offsets.

	// IF - OR + SIGN AT THE BEGINNING OF THE E NOTATION STRING IS MISSING,
	// ASSUME IT-S A + AND ADD IT.
	state.setZoom(value);

	// todo: make sure value is valid e notation number
	await get(workersManager).setZoom({ zoomLevelAsENotation: get(state).zoomAsENotation });

	get(workersManager).parallelizeCalculation();
};
