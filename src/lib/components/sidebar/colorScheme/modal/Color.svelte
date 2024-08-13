<script lang="ts">
	import type { RGBColor } from '$lib/mandelbrot_renderer/src/types';
	import ColorPicker from 'svelte-awesome-color-picker';
	import ColorPickerWrapper from './ColorPickerWrapper.svelte';

	export let color: RGBColor;
	export let onChange: (newColor: RGBColor) => void;
	export let onRemove: () => void;

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
	<button on:click={onRemove} class="remove-button">x</button>
</div>

<div id="color-picker-portal"></div>

<style>
	#color-picker-portal {
		position: absolute;
	}

	:global(.color-modal-container .color) {
		box-shadow: 1px 1px 1px black;
	}

	.remove-button {
		display: inline-block;
		font-size: 13px;
		padding: 0px 5px;
		vertical-align: top;
		margin-left: -10px;
		color: #666;
	}
	.remove-button:hover {
		color: red;
	}
</style>
