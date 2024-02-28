<script>
	import MapWrapper from '$lib/MapWrapper.svelte';
	import { browser } from '$app/env';
</script>

<code>{browser}</code>
<MapWrapper />

<style>
	code {
		position: absolute;
		top: 0;
		right: 0;
	}
</style>
