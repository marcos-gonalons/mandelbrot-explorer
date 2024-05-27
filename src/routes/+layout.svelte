<script>
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import './styles.css';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<title>Mandelbrot</title>
	<meta name="description" content="Mandelbrot explorer" />
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
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
		background: #000000;
	}
</style>
