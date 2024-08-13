<script lang="ts">
	import type { RGBColor } from '$lib/mandelbrot_renderer/src/types';
	import Button, { Label } from '@smui/button';
	import Dialog, { Actions, Content, Title } from '@smui/dialog';
	import { state } from '../../../../../stores/mandelbrotState/store';
	import { workersManager } from '../../../../../stores/workersManager/store';
	import { getTranslation } from '../../../../../translations';

	import AddNewColor from './AddNewColor.svelte';
	import Color from './Color.svelte';

	export let onClose: () => void;

	let colorScheme = structuredClone($state.colorScheme);
	let reRender: number = 0;

	const onChange = (index: number, newColor: RGBColor) => (colorScheme[index] = newColor);

	const onRemove = (index: number) => {
		if (colorScheme.length === 1) {
			return;
		}

		colorScheme.splice(index, 1);
		reRender = Math.random();
	};

	const onAddNew = () => {
		colorScheme.push({
			r: 0,
			g: 0,
			b: 0,
			a: 255
		});

		reRender = Math.random();
	};

	const onApplyChanges = () => {
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
			{#key reRender}
				{#each colorScheme as color, i}
					<Color onRemove={() => onRemove(i)} {color} onChange={(c) => onChange(i, c)} />
				{/each}
			{/key}
			<AddNewColor {onAddNew} />
		</div>
	</Content>
	<Actions>
		<Button variant="raised" on:click={onApplyChanges}>
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
