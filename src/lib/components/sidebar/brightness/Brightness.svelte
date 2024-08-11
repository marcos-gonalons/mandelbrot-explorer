<script lang="ts">
	import { defaultState, state } from '../../../../stores/mandelbrotState/store';
	import { workersManager } from '../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../translations';

	import Slider from '../Slider.svelte';

	let min: number = 0.1;
	let max: number = 100;
	let step: number = 0.1;
	let value: number = defaultState.brightness;

	const onChange = (e: CustomEvent) => {
		const brightness = (e.detail as { value: number }).value;

		$workersManager.queue(async () => {
			$workersManager.setBrightness({ value: brightness });
			await $workersManager.parallelizeCalculation();
		});
	};

	const onInput = (e: CustomEvent) => {
		const brightness = (e.detail as { value: number }).value;
		state.setBrightness(brightness);
	};
</script>

<Slider
	label={`${getTranslation('sidebar.brightnessLabel')} ${$state.brightness}%`}
	{value}
	{onChange}
	{onInput}
	{min}
	{max}
	{step}
/>
