<script lang="ts">
	import FormField from '@smui/form-field';
	import Slider from '@smui/slider';
	import { canvasStore } from '../../../../stores/canvas/store';
	import { workersManager } from '../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../translations';

	let value = 100;

	const onChange = (e: CustomEvent) => {
		const value = (e.detail as { value: number }).value;

		const container = $canvasStore.canvasContainer!;
		const canvas = $canvasStore.canvas!;

		container.style.borderRadius = '0px';
		canvas.style.borderRadius = '0px';
		container.style.width = `${value}%`;
		container.style.height = `${value}%`;
		container.style.top = `${(100 - value) / 2}%`;
		container.style.left = `${(100 - value) / 2}%`;

		if (value < 100) {
			container.style.borderRadius = '20px';
			canvas.style.borderRadius = '20px';
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
