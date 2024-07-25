<script lang="ts">
	import { workersManager } from '../../../../stores/workersManager/store';

	async function reset() {
		$workersManager.initCanvas();
		document.location.href = document.location.href;
	}
</script>

<button on:click={reset}>Reset</button>
