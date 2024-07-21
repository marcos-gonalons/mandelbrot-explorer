<script lang="ts">
	import Textfield from '@smui/textfield';
	import { defaultState, state } from '../../../../stores/state/store';
	import { workersManager } from '../../../../stores/workersManager/store';

	async function onChangeMaxIterations({ target }: Event) {
		const value = parseInt((target as HTMLInputElement).value);

		// todo: validate and show toast for invalid values
		state.setMaxIterations(isNaN(value) ? defaultState.maxIterations : value);

		// todo: make sure $state.maxIterations is valid
		await $workersManager.setMaxIterations({ value: $state.maxIterations });

		$workersManager.parallelizeCalculation();
	}
</script>

<Textfield
	type="number"
	value={$state.maxIterations}
	on:change={onChangeMaxIterations}
	style="min-width: 250px;"
/>
