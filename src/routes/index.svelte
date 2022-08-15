<script>
	import { onMount, onDestroy } from 'svelte';
	// import maplibregl from 'maplibre-gl';
	import { Map, NavigationControl } from 'maplibre-gl';
	let map;
	let mapContainer;

	let zoomLvl = 1;

	onMount(() => {
		map = new Map({
			container: mapContainer,
			style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
			center: [-74.5, 40], // starting position [lng, lat]
			zoom: zoomLvl // starting zoom
		});
	});

	// onDestroy(() => {
	// 	map.remove();
	// });
</script>

<h1>MapLibre</h1>
Zoom:<input type="number" bind:value={zoomLvl} />
<div id="map" bind:this={mapContainer} style="width: 100vw; height: 80vh; position: relative;" />

<style>
	:global(.maplibregl-ctrl-bottom-right, details.mapboxgl-ctrl-attrib) {
		position: absolute;
		left: 0;
		bottom: 0;
	}
</style>
