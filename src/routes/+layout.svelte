<script>
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import './styles.css';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<title>Mandelbrot</title>
	<meta name="description" content="Mandelbrot explorer" />
</svelte:head>

<div class="app">
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: #000;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
