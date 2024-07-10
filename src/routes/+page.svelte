<script lang="ts">
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';

	let isSidebarOpen = false;
</script>

<section>
	<Sidebar bind:open={isSidebarOpen} />
	<Navbar bind:isSidebarOpen />
</section>

<style>
</style>
