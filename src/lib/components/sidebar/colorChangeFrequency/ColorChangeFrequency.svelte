<script lang="ts">
	import { state } from '../../../../stores/mandelbrotState/store';
	import { workersManager } from '../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../translations';

	import Slider from '../Slider.svelte';

	let min: number = 0;
	let max: number = 500;
	let step: number = 5;
	let value: number = max - $state.colorChangeFrequency;

	const onChange = (e: CustomEvent) => {
		$workersManager.queue(async () => {
			$workersManager.setColorChangeFrequency({ value: getValue(e) });
			await $workersManager.parallelizeCalculation();
		});
	};

	const onInput = (e: CustomEvent) => state.setColorChangeFrequency(getValue(e));

	function getValue(e: CustomEvent): number {
		const frequency = max - (e.detail as { value: number }).value;

		if (frequency <= 0) {
			return 1;
		}

		return frequency;
	}
</script>

<Slider
	label={getTranslation('sidebar.colorChangeFrequencyLabel')}
	{value}
	{onChange}
	{onInput}
	{min}
	{max}
	{step}
/>
