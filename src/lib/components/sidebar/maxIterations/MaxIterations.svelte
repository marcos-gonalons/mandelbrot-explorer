<script lang="ts">
	import Textfield from '@smui/textfield';

	import { state } from '../../../../stores/state/store';
	import { getTranslation } from '../../../../translations';

	import { onChange } from './onChange';
</script>

<Textfield
	value={$state.maxIterations}
	on:change={onChange}
	style="width: 100%"
	label={getTranslation('sidebar.maxIterations.label')}
/>
