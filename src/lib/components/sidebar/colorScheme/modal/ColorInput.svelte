<script lang="ts">
	import { onMount } from 'svelte';

	export let labelElement: HTMLLabelElement;
	export let hex: string | undefined;
	export let label: string;
	export let name: string | undefined;
	export let isOpen: boolean;

	onMount(() => (labelElement.style.background = hex!));
</script>

<label for="" bind:this={labelElement}></label>

<style>
	label {
		cursor: pointer;
		border-radius: 50%;
		width: 45px;
		height: 45px;
		display: inline-block;
		box-shadow: 1px 1px 1px black;
	}
</style>
