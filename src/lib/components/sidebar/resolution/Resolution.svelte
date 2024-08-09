<script lang="ts">
	import FormField from '@smui/form-field';
	import Slider from '@smui/slider';
	import { workersManager } from '../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../translations';

	let lowestResolution: number = 10;
	let highestResolution: number = 1;

	let value: number = lowestResolution;

	const onChange = (e: CustomEvent) => {
		const resolution = lowestResolution + 1 - (e.detail as { value: number }).value;

		$workersManager.queue(async () => {
			$workersManager.setResolution(resolution);
			await $workersManager.parallelizeCalculation();
		});
	};
</script>

<FormField align="end" style="display: flex;">
	<Slider
		min={highestResolution}
		max={lowestResolution}
		style="flex-grow: 1;"
		bind:value
		on:SMUISlider:input={onChange}
	/>
	<span slot="label" style="padding-right: 12px; width: max-content; display: block;">
		{getTranslation('sidebar.resolutionLabel')}
	</span>
</FormField>

<style>
</style>
