<script lang="ts">
	import type { RGBColor } from '$lib/mandelbrot_renderer/src/types';
	import ColorPicker from 'svelte-awesome-color-picker';

	export let color: RGBColor;
	export let onChange: (newColor: RGBColor) => void;

	const _onChange = ({ detail }: CustomEvent) => onChange((detail as { rgb: RGBColor }).rgb);
</script>

<ColorPicker label="" rgb={color} position="responsive" on:input={_onChange} />
