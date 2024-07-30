<script lang="ts">
	import { state } from '../../../../stores/mandelbrotState/store';
	import { getTranslation } from '../../../../translations';
	import TextInput from '../TextInput.svelte';
	import { onChange as onChangeOffset } from './onChange';

	const onChange = ({ target }: Event) => {
		onChangeOffset((target as HTMLInputElement).value, 'x');
	};
</script>

<TextInput
	value={$state.offsetsAsENotation.x}
	label={getTranslation('sidebar.xOffsetLabel')}
	{onChange}
/>
