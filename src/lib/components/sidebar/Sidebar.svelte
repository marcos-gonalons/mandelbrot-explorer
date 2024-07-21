<script lang="ts">
	import Textfield from '@smui/textfield';
	import { defaultState, state } from '../../../stores/state/store';
	import { workersManager } from '../../../stores/workersManager/store';

	export let open = false;

	async function onChangeMaxIterations({ target }: Event) {
		const value = parseInt((target as HTMLInputElement).value);

		// todo: validate and show toast for invalid values
		console.log(defaultState.maxIterations);
		state.setMaxIterations(isNaN(value) ? defaultState.maxIterations : value);

		// todo: make sure $state.maxIterations is valid
		await $workersManager.setMaxIterations({ value: $state.maxIterations });

		$workersManager.parallelizeCalculation();
	}
</script>

<aside class="absolute w-full h-full bg-gray-200 border-r-2 shadow-lg" class:open>
	<Textfield
		type="number"
		value={$state.maxIterations}
		on:change={onChangeMaxIterations}
		style="min-width: 250px;"
	/>
</aside>

<style>
	@media (min-width: 0px) {
		aside {
			right: -250px;
			width: 250px;
		}
	}

	@media (min-width: 1200px) {
		aside {
			right: -350px;
			width: 350px;
		}
	}

	aside {
		transition: right 0.3s ease-in-out;
	}

	.open {
		right: 0;
	}
</style>
