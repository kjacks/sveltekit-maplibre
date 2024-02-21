<script>
	// import { env } from '$env/dynamic/private';

	import { onMount } from 'svelte';
	// import maplibregl from 'maplibre-gl';
	// import { Map, NavigationControl } from 'maplibre-gl';
	import pkg from 'maplibre-gl';
	const { Map, NavigationControl } = pkg;
	import 'maplibre-gl/dist/maplibre-gl.css';

	const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY
	const SOURCE_ID = 'openmaptiles'
	const LAYER_ID = '3d-buildings'

	let map;
	let mapContainer;
	let isLoaded = false;
	let tallBuildingsVisible = true;
	let hoveredFeature;
	let heightFilterValue = 1


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

			map.addSource(SOURCE_ID, {
				url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
				type: 'vector',
			});

			map.addLayer(
				{
					'id': LAYER_ID,
					'source': SOURCE_ID,
					'source-layer': 'building',
					'type': 'fill-extrusion',
					'minzoom': 15,
					'paint': {
						'fill-extrusion-color': [
		          'case',
		          ['boolean', ['feature-state', 'hover'], false],
		          '#ff0000',
		          '#ddd'
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
									],
					}
				},
				labelLayerId
			);

			map.on('mousemove', function(e) {
					//157001066
					var features = map.queryRenderedFeatures(e.point, {
							layers: ['3d-buildings']
					});
					if (features[0]) {
							mouseover(features[0]);
					} else {
							mouseout();
					}

			});

			map.on('mouseout', function(e) {
					mouseout();
			});

			function mouseout() {
					if (!hoveredFeature) return;
					map.getCanvasContainer().style.cursor = 'default';
					map.setFeatureState({
							source: hoveredFeature.source,
							sourceLayer: hoveredFeature.sourceLayer,
							id: hoveredFeature.id
					}, {
							hover: false
					});

			}

			function mouseover(feature) {
					hoveredFeature = feature;
					map.getCanvasContainer().style.cursor = 'pointer';

					map.setFeatureState({
							source: hoveredFeature.source,
							sourceLayer: hoveredFeature.sourceLayer,
							id: hoveredFeature.id
					}, {
							hover: true
					});
			}



				// map.on('mousemove', LAYER_ID, (e) => {
				// 				if (e.features.length > 0) {
				// 								if (hoveredFeatureId) {
				// 												map.setFeatureState(
				// 																{source: SOURCE_ID, sourceLayer: 'buildings', id: hoveredFeatureId},
				// 																{hover: false}
				// 												);
				// 								}
				// 								hoveredFeatureId = e.features[0].id;
				// 								map.setFeatureState(
				// 												{source: SOURCE_ID, sourceLayer: 'buildings', id: hoveredFeatureId},
				// 												{hover: true}
				// 								);
				// 				}
				// });

				// map.on('mouseleave', LAYER_ID, () => {
				// 				if (hoveredFeatureId) {
				// 								map.setFeatureState(
				// 												{source: SOURCE_ID, sourceLayer: 'buildings', id: hoveredFeatureId},
				// 												{hover: false}
				// 								);
				// 				}
				// 				hoveredFeatureId = null;
				});
	});

	const filterMapHeights = () => {
		map?.setFilter(LAYER_ID, ['<=', 'render_height', heightFilterValue])
	}

	$: heightFilterValue, filterMapHeights()

	$: console.log(heightFilterValue, hoveredFeature)

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

<input id="slider" type="range" min="0" max="300" step="10" bind:value={heightFilterValue} />

<button on:click={toggleTallBuildingVisibity}>{tallBuildingsVisible ? "Hide tall buildings" : "Show tall buildings"}</button>


<div id="map" bind:this={mapContainer} />

<style>
	#map {
		width: 100vw;
		height: 80vh;
		position: relative;
	}
</style>
