<script>
	// import { env } from '$env/dynamic/private';

	import { onMount } from 'svelte';
	// import maplibregl from 'maplibre-gl';
	// import { Map, NavigationControl } from 'maplibre-gl';
	import pkg from 'maplibre-gl';
	const { Map, NavigationControl } = pkg;
	import 'maplibre-gl/dist/maplibre-gl.css';


	let map;
	let mapContainer;
	let isLoaded = false;
	let tallBuildingsVisible = true;

	const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY

	onMount(() => {
		map = new Map({
			container: mapContainer,
			style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
			center: [-74.0066, 40.7135], // starting position [lng, lat]
			zoom: 15.5, // starting zoom
			pitch: 45,
			bearing: -17.6
		});

		map.addControl(
			new NavigationControl({
				showZoom: true,
				showCompass: false
			}),
			'top-right'
		);
		isLoaded = true;

		// The 'building' layer in the streets vector source contains building-height
  // data from OpenStreetMap.
  map.on('load', () => {
			// Insert the layer beneath any symbol layer.
			const layers = map.getStyle().layers;

			let labelLayerId;
			for (let i = 0; i < layers.length; i++) {
				if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
					labelLayerId = layers[i].id;
					break;
				}
			}

			map.addSource('openmaptiles', {
				url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
				type: 'vector',
			});

			map.addLayer(
				{
					'id': '3d-buildings',
					'source': 'openmaptiles',
					'source-layer': 'building',
					'type': 'fill-extrusion',
					'minzoom': 15,
					'paint': {
									'fill-extrusion-color': [
													'interpolate',
													['linear'],
													['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
									],
									'fill-extrusion-height': [
													'interpolate',
													['linear'],
													['zoom'],
													15,
													0,
													16,
													['get', 'render_height']
									],
									'fill-extrusion-base': ['case',
													['>=', ['get', 'zoom'], 16],
													['get', 'render_min_height'], 0
									]
					}
				},
				labelLayerId
			);
  });
	});

	const toggleTallBuildingVisibity = () => {
		console.log('toggling')

		if (tallBuildingsVisible) {
			map.setFilter('3d-buildings', ['<=', 'render_height', 100]);
		} else {
			map.setFilter('3d-buildings', null)
		}

		tallBuildingsVisible = !tallBuildingsVisible
	}
</script>

<button on:click={toggleTallBuildingVisibity}>{tallBuildingsVisible ? "Hide tall buildings" : "Show tall buildings"}</button>

<div id="map" bind:this={mapContainer} />

<style>
	#map {
		width: 100vw;
		height: 80vh;
		position: relative;
	}
</style>
