<script lang="ts">
	import FormField from '@smui/form-field';
	import Slider from '@smui/slider';
	import { canvasContainer } from '../../../../stores/canvasContainer/store';
	import { workersManager } from '../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../translations';

	let value = 100;

	const onChange = (e: CustomEvent) => {
		const value = (e.detail as { value: number }).value;

		$canvasContainer.style.borderRadius = '0px';
		$canvasContainer.style.width = `${value}%`;
		$canvasContainer.style.height = `${value}%`;
		$canvasContainer.style.top = `${(100 - value) / 2}%`;
		$canvasContainer.style.left = `${(100 - value) / 2}%`;

		if (value < 100) {
			$canvasContainer.style.borderRadius = '20px';
		}

		$workersManager.initCanvas();
		$workersManager.parallelizeCalculation();
	};
</script>

<FormField align="end" style="display: flex;">
	<Slider min={20} max={100} style="flex-grow: 1;" bind:value on:SMUISlider:input={onChange} />
	<span slot="label" style="padding-right: 12px; width: max-content; display: block;">
		{getTranslation('sidebar.resizer.label')}
	</span>
</FormField>

<style>
</style>
