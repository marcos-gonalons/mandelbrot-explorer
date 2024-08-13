<script lang="ts">
	export let onAddNew: () => void;
</script>

<button on:click={onAddNew}>
	<span>+</span>
</button>

<style>
	button {
		border: 1px solid grey;
		width: 42px;
		height: 42px;
		border-radius: 50%;
		font-size: 25px;
		margin-left: 16px;
		color: black;
	}
	button:hover {
		color: green;
	}
</style>
