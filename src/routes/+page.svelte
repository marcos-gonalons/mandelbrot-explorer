<script lang="ts">
	import { onMount } from 'svelte';

	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	import { waitUntilWASMWorkersAreReady } from '$lib/utils';
	import { stateStore } from '../stores/state/store';

	let isSidebarOpen = false;

	onMount(async () => {
		await waitUntilWASMWorkersAreReady();
		workersManager.setState({ state: $stateStore });

		await waitUntilWASMWorkersAreReady();
		workersManager.parallelizeCalculation();
	});
</script>

<section>
	<Sidebar bind:open={isSidebarOpen} />
	<Navbar bind:isSidebarOpen />
</section>

<style>
</style>
