<script lang="ts">
	import { onMount } from 'svelte';
	import { Shadow } from 'svelte-loading-spinners';

	import { canvasContainer as canvasContainerStore } from '../../../stores/canvasContainer/store';
	import { state } from '../../../stores/mandelbrotState/store';
	import { workersManager } from '../../../stores/workersManager/store';

	let canvasContainer: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let spinner: HTMLDivElement;

	onMount(async () => {
		const ProgressBar = (await import('progressbar.js')).default;
		const initRenderer = (await import('$lib/mandelbrot_renderer/src/canvas_service/main')).init;

		const progressBar = document.createElement('div');
		progressBar.setAttribute('id', 'progress-bar');
		document.body.prepend(progressBar);

		try {
			workersManager.set(
				await initRenderer(
					canvasContainer,
					canvas,
					new ProgressBar.Line(progressBar, {
						easing: 'easeInOut',
						strokeWidth: 0.25,
						color: '#e41f1f'
					})
				)
			);

			await $workersManager.setState({ state: $state });

			$workersManager.parallelizeCalculation();

			spinner.style.visibility = 'hidden';
		} catch (e: unknown) {}

		canvasContainerStore.set(canvasContainer);
	});
</script>

<div id="canvas-container" bind:this={canvasContainer}>
	<div bind:this={spinner} class="spinner-container">
		<Shadow size="60" color="#FF3E00" unit="px" duration="1s" />
	</div>
	<canvas id="canvas" bind:this={canvas}></canvas>
</div>

<style>
	#canvas-container {
		position: fixed;
		cursor: grab;
		background-color: black;
		box-shadow:
			1px -1px 5px #222,
			-1px -1px 5px #000000;
		width: 100%;
		height: 100%;
		top: 0%;
		left: 0%;
	}

	#canvas {
		border-radius: 20px;
	}

	.spinner-container {
		left: 50%;
		position: absolute;
		top: 50%;
	}
</style>
