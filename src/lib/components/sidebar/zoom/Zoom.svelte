<script lang="ts">
	import Textfield from '@smui/textfield';

	import { state } from '../../../../stores/state/store';
	import { workersManager } from '../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../translations';

	async function onChangeZoom({ target }: Event) {
		const value = (target as HTMLInputElement).value;

		// todo: validate and show toast for invalid values
		state.setZoom(value);

		// todo: make sure value is valid e notation number
		await $workersManager.setZoom({ zoomLevelAsENotation: $state.zoomAsENotation });

		$workersManager.parallelizeCalculation();
	}
</script>

<Textfield
	value={$state.zoomAsENotation}
	on:change={onChangeZoom}
	style="width: 100%"
	label={getTranslation('sidebar.zoomLabel')}
/>
