<script>
	import Hamburger from '../hamburger/Hamburger.svelte';

	export let sidebar = false;
</script>

<nav class="flex navbar">
	<Hamburger bind:open={sidebar} />
</nav>

<style>
	.navbar {
		float: right;
		margin-top: 20px;
		margin-right: 10px;
	}
</style>
