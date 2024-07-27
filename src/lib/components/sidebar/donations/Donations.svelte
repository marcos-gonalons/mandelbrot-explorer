<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		PayPal.Donation.Button({
			env: 'production',
			hosted_button_id: 'MBFM3NXW9D7AQ',
			image: {
				src: 'https://www.paypalobjects.com/en_US/ES/i/btn/btn_donateCC_LG.gif',
				alt: 'Donate with PayPal button',
				title: 'PayPal - The safer, easier way to pay online!'
			}
		}).render('#paypal-donate-button');
	});
</script>

<div id="donations-container">
	<div id="paypal-donate-button"></div>
</div>

<style>
	#donations-container {
		position: absolute;
		width: 100%;
		bottom: 20px;
	}
	:global(#donate-button) {
		display: block;
		margin-left: auto;
		margin-right: auto;
	}
</style>
