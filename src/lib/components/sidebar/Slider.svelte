<script lang="ts">
	import FormField from '@smui/form-field';
	import Slider from '@smui/slider';

	export let label: string;
	export let onChange: (e: CustomEvent) => void;
	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number = 1;
</script>

<div>
	<span class="label">{label}</span>
	<div class="slider-container">
		<FormField align="end" style="display: flex;">
			<Slider {step} {min} {max} style="flex-grow: 1;" bind:value on:SMUISlider:input={onChange} />
		</FormField>
	</div>
</div>

<style>
	.label {
		font-size: 13px;
	}
	.slider-container {
		margin-top: -15px;
		margin-bottom: -15px;
		margin-left: -30px;
		width: 115%;
	}
</style>
