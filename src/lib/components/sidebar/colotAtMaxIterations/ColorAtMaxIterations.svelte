<script lang="ts">
	import type { RGBColor } from '$lib/mandelbrot_renderer/src/types';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { state } from '../../../../stores/mandelbrotState/store';
	import { workersManager } from '../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../translations';

	let changeInterval: ReturnType<typeof setInterval> | null;
	let latestColor: RGBColor;

	const onChange = ({ detail }: CustomEvent) => {
		const color = (detail as { rgb: RGBColor }).rgb;
		color.a = Math.round(color.a * 255);
		latestColor = color;
		if (changeInterval) return;

		changeInterval = setInterval(() => {
			queueChangeRequest();

			clearInterval(changeInterval as ReturnType<typeof setInterval>);
			changeInterval = null;

			setTimeout(queueChangeRequest, 100);
		}, 1000);
	};

	function queueChangeRequest() {
		$workersManager.queue(async () => {
			state.setColorAtMaxIterations(latestColor);
			await $workersManager.setColorAtMaxIterations({ color: latestColor });
			$workersManager.parallelizeCalculation();
		});
	}
</script>

<ColorPicker
	label={getTranslation('sidebar.colorAtMaxIterations.label')}
	rgb={$state.colorAtMaxIterations}
	position="responsive"
	on:input={onChange}
/>
