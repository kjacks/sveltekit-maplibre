<script>
	import { browser } from '$app/env';
	// import DualSwipe from '$lib/Dual/DualSwipe.svelte';
	let DualSwipe;
	$: if (browser) {
		DualSwipe = import('$lib/Dual/DualSwipe.svelte').default;
	}
</script>

<p>Browser: {browser}</p>

{JSON.stringify(DualSwipe)}

{#if browser && DualSwipe}
	<svelte:component this={DualSwipe} />
{/if}
