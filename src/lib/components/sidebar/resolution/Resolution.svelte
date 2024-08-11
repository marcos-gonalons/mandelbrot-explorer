<script lang="ts">
	import { workersManager } from '../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../translations';
	import Slider from '../Slider.svelte';

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

<Slider
	label={getTranslation('sidebar.resolutionLabel')}
	{value}
	{onChange}
	min={highestResolution}
	max={lowestResolution}
/>
