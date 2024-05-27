<script>
	export let open = false;
</script>

<aside class="absolute w-full h-full bg-gray-200 border-r-2 shadow-lg" class:open>
	<nav class="p-12 text-xl">Sidebar</nav>
</aside>

<style>
	aside {
		right: -250px;
		width: 250px;
		transition: right 0.3s ease-in-out;
	}

	.open {
		right: 0;
	}
</style>
