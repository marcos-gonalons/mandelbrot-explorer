<script lang="ts">
	import MaxIterations from './maxIterations/MaxIterations.svelte';
	import Reset from './reset/Reset.svelte';
	import Zoom from './zoom/Zoom.svelte';

	export let open = false;
</script>

<aside class="absolute w-full h-full bg-gray-200 border-r-2 shadow-lg" class:open>
	<header class="header">Mandelbrot Explorer</header>
	<section class="configurations">
		<div class="input-container"><MaxIterations /></div>
		<div class="input-container"><Zoom /></div>
		<Reset />
	</section>
</aside>

<style>
	@media (min-width: 0px) {
		aside {
			right: -250px;
			width: 250px;
		}
	}

	@media (min-width: 1200px) {
		aside {
			right: -350px;
			width: 350px;
		}
	}

	aside {
		transition: right 0.3s ease-in-out;
		padding: 0 25px;
	}

	.open {
		right: 0;
	}

	.header {
		padding-left: 10px;
		margin-top: 14px;
		margin-bottom: 40px;
		font-weight: bold;
		font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
			sans-serif;
		font-size: 25px;
	}

	.configurations {
		overflow: hidden;
	}

	.input-container {
		margin-bottom: 20px;
	}
</style>
