<script lang="ts">
	import Canvas from '$lib/components/canvas/Canvas.svelte';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';

	let isSidebarOpen = false;
</script>

<Canvas />

<section>
	<Sidebar bind:open={isSidebarOpen} />
	<Navbar bind:isSidebarOpen />
</section>

<style>
</style>
