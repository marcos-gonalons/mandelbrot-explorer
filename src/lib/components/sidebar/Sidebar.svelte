<script lang="ts">
	import { state } from '../../../stores/mandelbrotState/store';
	import { getTranslation } from '../../../translations';
	import ColorScheme from './colorScheme/ColorScheme.svelte';
	import ColorAtMaxIterations from './colotAtMaxIterations/ColorAtMaxIterations.svelte';
	import Donations from './donations/Donations.svelte';
	import XOffset from './offsets/XOffset.svelte';
	import YOffset from './offsets/YOffset.svelte';
	import Reset from './reset/Reset.svelte';
	import Resizer from './resizer/Resizer.svelte';
	import Resolution from './resolution/Resolution.svelte';
	import Saturation from './saturation/Saturation.svelte';
	import TextInput from './TextInput.svelte';
	import { onChange as onChangeZoom } from './zoom/onChange';

	export let open = false;
</script>

<aside class="absolute w-full h-full bg-gray-200 border-r-2 shadow-lg" class:open>
	<div class="main-container">
		<header class="header">Mandelbrot Explorer</header>
		<section class="configurations">
			<div class="input-container"></div>
			<div class="input-container">
				<TextInput
					value={$state.zoomAsENotation}
					onChange={onChangeZoom}
					label={getTranslation('sidebar.zoomLabel')}
				/>
			</div>
			<div class="input-container">
				<XOffset />
			</div>
			<div class="input-container">
				<YOffset />
			</div>
			<div class="input-container">
				<Resolution />
			</div>
			<div class="input-container">
				<Resizer />
			</div>
			<div class="input-container">
				<Saturation />
			</div>
			<div class="input-container">
				<ColorAtMaxIterations />
			</div>
			<div class="input-container">
				<ColorScheme />
			</div>
			<Reset />
		</section>
	</div>
	<div class="donations-container">
		<Donations />
	</div>
</aside>

<style>
	aside {
		right: -350px;
		width: 350px;
		transition: right 0.3s ease-in-out;
		background: linear-gradient(
			240deg,
			rgb(255, 255, 255) 0%,
			rgb(255, 255, 255) 0%,
			rgb(201, 234, 255) 100%
		);
	}

	.main-container {
		overflow-y: auto;
		height: 90%;
		padding: 0 25px;
	}
	.donations-container {
		height: 10%;
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

	.input-container {
		margin-bottom: 20px;
	}
</style>
