<script lang="ts">
	async function reset() {
		document.location.href = document.location.href;
	}
</script>

<button on:click={reset}>Reset</button>
