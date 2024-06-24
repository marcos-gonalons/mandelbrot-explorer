<script lang="ts">
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';

	let open = false;
</script>

<section>
	<Sidebar bind:open />
	<Navbar bind:sidebar={open} />
</section>

<style>
</style>
