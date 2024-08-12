<script lang="ts">
	import type { RGBColor } from '$lib/mandelbrot_renderer/src/types';
	import ColorPicker from 'svelte-awesome-color-picker';
	import ColorInput from './ColorInput.svelte';
	import ColorPickerWrapper from './ColorPickerWrapper.svelte';

	export let color: RGBColor;
	export let onChange: (newColor: RGBColor) => void;

	const _onChange = ({ detail }: CustomEvent) => onChange((detail as { rgb: RGBColor }).rgb);
</script>

<ColorPicker
	components={{ wrapper: ColorPickerWrapper, input: ColorInput }}
	rgb={color}
	on:input={_onChange}
/>

<div id="color-picker-portal"></div>

<style>
	#color-picker-portal {
		position: absolute;
	}
</style>
