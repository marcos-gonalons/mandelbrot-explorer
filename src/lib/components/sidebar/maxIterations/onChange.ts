import { get } from 'svelte/store';
import Toastify from 'toastify-js';

import { getTranslation } from '../../../../translations';

import { defaultState, state } from '../../../../stores/state/store';
import { workersManager } from '../../../../stores/workersManager/store';

const TOO_MANY_ITERATIONS = 10000;

export const onChange = async ({ target }: Event) => {
	const intValue = parseInt((target as HTMLInputElement).value);
	let maxIterations = isNaN(intValue) ? defaultState.maxIterations : intValue;

	if (maxIterations < 1) {
		maxIterations = defaultState.maxIterations;
		validationToast(getTranslation('sidebar.maxIterations.tooFewValidationMessage'));
	}

	if (maxIterations > TOO_MANY_ITERATIONS) {
		validationToast(getTranslation('sidebar.maxIterations.tooManyValidationMessage'));
	}

	const manager = get(workersManager);
	manager.queue(async () => {
		state.setMaxIterations(maxIterations);
		await manager.setMaxIterations({ value: get(state).maxIterations });
		manager.parallelizeCalculation();
	});
};

function validationToast(message: string) {
	Toastify({
		text: message,
		position: 'center',
		duration: -1,
		close: true
	}).showToast();
}
