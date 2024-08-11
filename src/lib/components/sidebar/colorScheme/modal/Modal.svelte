<script lang="ts">
	import Button, { Label } from '@smui/button';
	import Dialog, { Actions, Content, Title } from '@smui/dialog';

	export let open: boolean = false;
	export let onClose: () => void;
</script>

<Dialog
	on:SMUIDialog:closed={onClose}
	bind:open
	aria-labelledby="simple-title"
	aria-describedby="simple-content"
>
	<Title id="simple-title">Dialog Title</Title>
	<Content id="simple-content">Super awesome dialog body text?</Content>
	<Actions>
		<Button>
			<Label>Save</Label>
		</Button>
	</Actions>
</Dialog>
