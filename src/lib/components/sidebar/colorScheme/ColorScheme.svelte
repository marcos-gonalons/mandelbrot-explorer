<script lang="ts">
	import { getTranslation } from '../../../../translations';
	import Modal from './modal/Modal.svelte';

	let isModalVisible: boolean = false;
</script>

<button on:click={() => (isModalVisible = true)}>
	<span class="rainbow-gradient"></span>
	<span>{getTranslation('sidebar.colorScheme.label')}</span>
</button>

{#if isModalVisible}
	<Modal onClose={() => (isModalVisible = false)} />
{/if}

<style>
	button {
		margin-left: -6px;
		display: flex;
		align-items: center;
	}

	.rainbow-gradient {
		width: 25px;
		height: 25px;
		background: conic-gradient(
			from 90deg,
			violet,
			indigo,
			blue,
			green,
			yellow,
			orange,
			red,
			violet
		);
		margin: 10px;
		display: inline-block;
		border-radius: 50%;
	}
</style>
