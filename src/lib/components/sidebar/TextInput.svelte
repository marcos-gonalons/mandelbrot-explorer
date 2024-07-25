<script lang="ts">
	import Textfield from '@smui/textfield';

	export let value: string = '';
	export let onChange: (event: Event) => void = () => null;
	export let label: string = '';
</script>

<Textfield {value} on:change={onChange} style="width: 100%" {label} />
