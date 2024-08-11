<script lang="ts">
	import Button, { Label } from '@smui/button';
	import Dialog, { Actions, Content, Title } from '@smui/dialog';
	import { getTranslation } from '../../../../../translations';

	export let open: boolean = false;
	export let onClose: () => void;
</script>

<Dialog
	on:SMUIDialog:closed={onClose}
	bind:open
	aria-labelledby="simple-title"
	aria-describedby="simple-content"
>
	<Title id="simple-title">{getTranslation('sidebar.colorScheme.label')}</Title>
	<Content id="simple-content">Content</Content>
	<Actions>
		<Button>
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
