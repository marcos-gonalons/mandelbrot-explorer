<script lang="ts">
	import type { RGBColor } from '$lib/mandelbrot_renderer/src/types';
	import ColorPicker from 'svelte-awesome-color-picker';
	import ColorPickerWrapper from './ColorPickerWrapper.svelte';

	export let color: RGBColor;
	export let onChange: (newColor: RGBColor) => void;

	const _onChange = ({ detail }: CustomEvent) => onChange((detail as { rgb: RGBColor }).rgb);
</script>

<div class="color-modal-container">
	<ColorPicker
		components={{ wrapper: ColorPickerWrapper }}
		label=""
		--input-size="42px"
		rgb={color}
		on:input={_onChange}
	/>
</div>

<div id="color-picker-portal"></div>

<style>
	#color-picker-portal {
		position: absolute;
	}

	:global(.color-modal-container .color) {
		box-shadow: 1px 1px 1px black;
	}
</style>
