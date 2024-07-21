<script lang="ts">
	import { onMount } from 'svelte';

	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	import { waitUntilWASMWorkersAreReady } from '$lib/utils';
	import { stateStore } from '../stores/state/store';

	let isSidebarOpen = false;

	onMount(async () => {
		const ProgressBar = (await import('progressbar.js')).default;
		const canvasInit = (await import('$lib/mandelbrot_renderer/src/canvas_service/main')).init;

		const progressBar = document.createElement('div');
		progressBar.setAttribute('id', 'progress-bar');
		document.body.prepend(progressBar);

		const canvasContainer = document.createElement('div');
		canvasContainer.setAttribute('id', 'canvas-container');
		document.body.prepend(canvasContainer);

		const canvas = document.createElement('canvas');
		canvas.setAttribute('id', 'canvas');
		canvasContainer.append(canvas);

		canvasInit(
			canvasContainer,
			canvas,
			new ProgressBar.Line(progressBar, {
				easing: 'easeInOut',
				strokeWidth: 0.25,
				color: '#e41f1f'
			})
		);

		await waitUntilWASMWorkersAreReady();

		await workersManager.setState({ state: $stateStore });

		workersManager.parallelizeCalculation();
	});
</script>

<section>
	<Sidebar bind:open={isSidebarOpen} />
	<Navbar bind:isSidebarOpen />
</section>

<style>
</style>
