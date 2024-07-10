<script lang="ts">
	import Textfield from '@smui/textfield';

	export let open = false;

	let value: string | null = null;
</script>

<aside class="absolute w-full h-full bg-gray-200 border-r-2 shadow-lg" class:open>
	<Textfield
		type="email"
		updateInvalid
		bind:value
		label="To"
		style="min-width: 250px;"
		input$autocomplete="email"
	/>
</aside>

<style>
	@media (min-width: 0px) {
		aside {
			right: -250px;
			width: 250px;
		}
	}

	@media (min-width: 1200px) {
		aside {
			right: -350px;
			width: 350px;
		}
	}

	aside {
		transition: right 0.3s ease-in-out;
	}

	.open {
		right: 0;
	}
</style>
