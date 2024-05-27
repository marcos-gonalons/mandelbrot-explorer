<script>
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	import Navbar from '$lib/components/navbar/Navbar.svelte';

	let open = false;
</script>

<section>
	<Sidebar bind:open />
	<Navbar bind:sidebar={open} />
</section>

<style>
</style>
