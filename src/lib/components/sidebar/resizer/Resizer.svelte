<script lang="ts">
	import { canvasStore } from '../../../../stores/canvas/store';
	import { workersManager } from '../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../translations';
	import Slider from '../Slider.svelte';

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

<Slider label={getTranslation('sidebar.resizer.label')} {value} {onChange} min={20} max={100} />
