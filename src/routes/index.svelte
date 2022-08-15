<script>
	import { onMount } from 'svelte';
	// import maplibregl from 'maplibre-gl';
	import { Map, NavigationControl } from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	let map;
	let mapContainer;
	let isLoaded = false;

	let zoomLvl = 1;

	$: isLoaded &&
		map.zoomTo(zoomLvl, {
			duration: 600
		});

	onMount(() => {
		map = new Map({
			container: mapContainer,
			style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
			center: [-74.5, 40], // starting position [lng, lat]
			zoom: zoomLvl // starting zoom
		});

		map.addControl(
			new NavigationControl({
				showZoom: true,
				showCompass: false
			}),
			'top-right'
		);
		isLoaded = true;
	});
</script>

<h1>MapLibre</h1>
Zoom:<input type="number" bind:value={zoomLvl} />
<div id="map" bind:this={mapContainer} />

<style>
	#map {
		width: 100vw;
		height: 80vh;
		position: relative;
	}
</style>
