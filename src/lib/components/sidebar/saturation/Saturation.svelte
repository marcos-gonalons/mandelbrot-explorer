<script lang="ts">
	import { state } from '../../../../stores/mandelbrotState/store';
	import { workersManager } from '../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../translations';

	import Slider from '../Slider.svelte';

	let min: number = 0.1;
	let max: number = 100;
	let step: number = 0.1;
	let value: number = $state.saturation;

	const onChange = (e: CustomEvent) => {
		const saturation = (e.detail as { value: number }).value;

		$workersManager.queue(async () => {
			$workersManager.setSaturation({ value: saturation });
			await $workersManager.parallelizeCalculation();
		});
	};

	const onInput = (e: CustomEvent) => {
		const saturation = (e.detail as { value: number }).value;
		state.setSaturation(saturation);
	};
</script>

<Slider
	label={`${getTranslation('sidebar.saturationLabel')} ${$state.saturation}%`}
	{value}
	{onChange}
	{onInput}
	{min}
	{max}
	{step}
/>
