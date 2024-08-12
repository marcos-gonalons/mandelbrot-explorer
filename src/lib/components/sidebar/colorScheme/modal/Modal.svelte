<script lang="ts">
	import Button, { Label } from '@smui/button';
	import Dialog, { Actions, Content, Title } from '@smui/dialog';
	import { state } from '../../../../../stores/mandelbrotState/store';
	import { workersManager } from '../../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../../translations';
	import Color from './Color.svelte';

	export let onClose: () => void;

	let colorScheme = structuredClone($state.colorScheme);

	const onSave = () => {
		$workersManager.queue(async () => {
			state.setColorScheme(colorScheme);
			await $workersManager.setColorScheme({ scheme: colorScheme });
			$workersManager.parallelizeCalculation();
		});
	};
</script>

<Dialog
	on:SMUIDialog:closed={onClose}
	open={true}
	aria-labelledby="simple-title"
	aria-describedby="simple-content"
>
	<Title id="simple-title">{getTranslation('sidebar.colorScheme.label')}</Title>
	<Content>
		<div id="content">
			{#each colorScheme as color, i}
				<Color {color} onChange={(c) => (colorScheme[i] = c)} />
			{/each}
		</div>
	</Content>
	<Actions>
		<Button variant="raised" on:click={onSave}>
			<Label>
				{getTranslation('sidebar.colorScheme.applyButton')}
			</Label>
		</Button>
		<Button>
			<Label>
				{getTranslation('sidebar.colorScheme.cancelButton')}
			</Label>
		</Button>
	</Actions>
</Dialog>

<style>
	#content {
		display: grid;
		grid-template-columns: repeat(3, 33.3%);
		row-gap: 20px;
		text-align: center;
	}
	:global(.mdc-dialog__surface) {
		overflow-x: hidden;
	}
</style>
