<script lang="ts">
	import { onMount } from 'svelte';

	import { state } from '../../../stores/state/store';
	import { workersManager } from '../../../stores/workersManager/store';

	let canvasContainer: HTMLDivElement;
	let canvas: HTMLCanvasElement;

	onMount(async () => {
		const ProgressBar = (await import('progressbar.js')).default;
		const initRenderer = (await import('$lib/mandelbrot_renderer/src/canvas_service/main')).init;

		const progressBar = document.createElement('div');
		progressBar.setAttribute('id', 'progress-bar');
		document.body.prepend(progressBar);

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
	});
</script>

<div id="canvas-container" bind:this={canvasContainer}>
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
	}

	@media (min-width: 0px) {
		#canvas-container {
			width: 100%;
			height: 100%;
			top: 0%;
			left: 0%;
		}
	}
	@media (min-width: 1000px) {
		#canvas-container {
			top: 5%;
			left: 5%;
			width: 90%;
			height: 90%;
			border-radius: 20px;
		}
		#canvas {
			border-radius: 20px;
		}
	}
</style>
