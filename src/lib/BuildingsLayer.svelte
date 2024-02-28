<script>
	// import { env } from '$env/dynamic/private';

	import { onMount, getContext } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	// import maplibregl from 'maplibre-gl';
	// import { Map, NavigationControl } from 'maplibre-gl';
	import pkg from 'maplibre-gl';
	const { Map, NavigationControl } = pkg;
	import 'maplibre-gl/dist/maplibre-gl.css';

	const SOURCE_ID = 'openmaptiles'
	const LAYER_ID = '3d-buildings'

	const tallBuildingFilterExpression = ['>', 'render_height', 100]; // Replace with your actual property name and value

	let isLoaded = false;
	let tallBuildingsVisible = true;
	let hoveredFeature;


	const map = getContext('map')
	const refLayer = getContext('refLayer')
	const MAPTILER_KEY = getContext('MAPTILER_KEY')

	$: console.log($map)

	onMount(() => {
		console.log('in buildings layer')

	})

	$: if ($map) {
		$map.addSource(SOURCE_ID, {
			url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
			type: 'vector',
		});

		$map.addLayer(
			{
				'id': LAYER_ID,
				'source': SOURCE_ID,
				'source-layer': 'building',
				'type': 'fill-extrusion',
				'minzoom': 15,
				'paint': {
					// 'fill-extrusion-color': ['get', 'colour'],
					// 'fill-extrusion-color': [
					// 				'case',
					// 				['boolean', ['feature-state', 'hover'], false],
					// 				'#ff0000',
					// 				['get', 'colour']
					// 		],
					'fill-extrusion-color': [
						'case',
								['boolean', ['feature-state', 'hover'], false],
								'#ff0000',
									[
										'interpolate',
													['linear'],
													['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
										]
					],
						'fill-extrusion-height': ['get', 'render_height'],
						'fill-extrusion-base': ['case',
										['>=', ['get', 'zoom'], 16],
										['get', 'render_min_height'], 0  
						],
				}
			},
			$refLayer
		);
	}


			

	// 		map.on('mousemove', function(e) {
	// 				//157001066
	// 				var features = map.queryRenderedFeatures(e.point, {
	// 						layers: ['3d-buildings']
	// 				});
	// 				if (features[0]) {
	// 						mouseover(features[0]);
	// 				} else {
	// 						mouseout();
	// 				}

	// 		});

	// 		map.on('mouseout', function(e) {
	// 				mouseout();
	// 		});

	// 		function mouseout() {
	// 				if (!hoveredFeature) return;
	// 				map.getCanvasContainer().style.cursor = 'default';
	// 				map.setFeatureState({
	// 						source: hoveredFeature.source,
	// 						sourceLayer: hoveredFeature.sourceLayer,
	// 						id: hoveredFeature.id
	// 				}, {
	// 						hover: false
	// 				});

	// 		}

	// 		function mouseover(feature) {
	// 				hoveredFeature = feature;
	// 				map.getCanvasContainer().style.cursor = 'pointer';

	// 				map.setFeatureState({
	// 						source: hoveredFeature.source,
	// 						sourceLayer: hoveredFeature.sourceLayer,
	// 						id: hoveredFeature.id
	// 				}, {
	// 						hover: true
	// 				});
	// 		}
	// 	});

	// 	isLoaded = true;

	// });

	// const filterMapHeights = () => {
	// 	map?.setFilter(LAYER_ID, ['<=', 'render_height', heightFilterValue])
	// }

	// $: heightFilterValue, filterMapHeights()

	// const buildingHeight = tweened(400, {
	// 	duration: 400,
	// 	easing: cubicOut
	// });

	// const toggleTallBuildingVisibity = () => {
	// 	if (tallBuildingsVisible) {
	// 		// map.setFilter('3d-buildings', ['<=', 'render_height', 100]);
	// 		buildingHeight.set(0)
	// 	} else {
	// 		// map.setFilter('3d-buildings', null)
	// 	 buildingHeight.set(400)
	// 	}

	// 	tallBuildingsVisible = !tallBuildingsVisible
	// }

	// $: if(map && isLoaded && $buildingHeight !== 400) {
	// 	map.setPaintProperty(LAYER_ID, 'fill-extrusion-height', [
	// 		"case",
 //    [
 //      "<", // Comparison operator (change as needed)
 //      ["get", "render_height"], // Your property name
 //      $buildingHeight // Your literal value
 //    ],
 //    ["get", "render_height"], // Return the property value if it's greater than the literal value
 //    $buildingHeight // Otherwise, return the literal value
	// 	], tallBuildingFilterExpression)
	// }


</script>

<!-- <input id="slider" type="range" min="0" max="300" step="10" bind:value={heightFilterValue} /> -->

<div>hello</div>

<style>

</style>
