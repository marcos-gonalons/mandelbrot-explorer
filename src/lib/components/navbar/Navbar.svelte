<script lang="ts">
	import Hamburger from '../hamburger/Hamburger.svelte';

	export let isSidebarOpen = false;
</script>

<nav class="flex navbar">
	<Hamburger bind:open={isSidebarOpen} />
</nav>

<style>
	.navbar {
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
</style>
