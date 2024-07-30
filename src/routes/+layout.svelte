<script lang="ts">
	import 'toastify-js/src/toastify.css';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { onMount } from 'svelte';
	import { language } from '../stores/language/store';
	import type { Language } from '../translations';
	import './styles.css';

	inject({ mode: dev ? 'development' : 'production' });

	onMount(() => language.set(navigator.language.split('-')[0] as Language));
</script>

<svelte:head>
	<title>Mandelbrot</title>
	<meta name="description" content="Mandelbrot explorer" />
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
	<script src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js" charset="UTF-8"></script>
</svelte:head>

{#key $language}
	<div class="app">
		<main>
			<slot />
		</main>
	</div>
{/key}

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		/*background-image: url('$lib/images/bg.jpg');*/
		background: radial-gradient(circle at center, black, #004873, white 108%);
	}
</style>
