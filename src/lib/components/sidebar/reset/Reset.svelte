<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { workersManager } from '../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../translations';

	async function reset() {
		$workersManager.initCanvas();
		document.location.href = document.location.href;
	}
</script>

<div class="button-container">
	<Button on:click={reset} variant="raised">
		<Label>{getTranslation('sidebar.resetButton')}</Label>
	</Button>
</div>

<style>
	.button-container {
		float: right;
	}
</style>
