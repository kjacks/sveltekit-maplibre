<script>
	import { onMount, setContext } from 'svelte'
	import pkg from 'maplibre-gl';
	const { Map, NavigationControl } = pkg;
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { writable } from 'svelte/store';

	const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY

	const map = writable()
	const refLayer = writable()

	let loaded = false
	let mapLibreMap
	let mapContainer

	setContext('map', map)
	setContext('refLayer', refLayer)
	setContext('MAPTILER_KEY', MAPTILER_KEY)


	onMount(() => {
		mapLibreMap = new Map({
			container: mapContainer,
			style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
			center: [-74.0066, 40.7135], // starting position [lng, lat]
			zoom: 15.5, // starting zoom
			pitch: 45,
			bearing: -17.6
		});

		mapLibreMap.addControl(
			new NavigationControl({
				showZoom: true,
				showCompass: false
			}),
			'top-right'
		);

		mapLibreMap.on('load', () => {
			const layers = mapLibreMap.getStyle().layers;

			let labelLayerId;
			for (let i = 0; i < layers.length; i++) {
				if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
					labelLayerId = layers[i].id;
					break;
				}
			}

			$map = mapLibreMap
			$refLayer = labelLayerId

			console.log('setting loaded')

			loaded = true
		})
	})

	$: console.log(loaded)
</script>

<div class="map-container">
	<div class="map" bind:this={mapContainer} />
	<div class="map-loading" class:loaded={loaded}>
		<div class="ts-spinner">
			<div class="ts-double-bounce1" />
			<div class="ts-double-bounce2" />
		</div>
	</div>
	{#if loaded}
		<slot>Test</slot>
	{/if}
</div>

<style lang="scss">
	.map-container {
		position: relative;
		margin-bottom: 0;
		transition: margin 0.3s ease;
	}

	:root {
		--map-height: 600px;
		--map-max-height: 80vh;
		--map-height-mobile: 500px;
		--map-max-height-mobile: 100vh;
	}
	.map {
		position: relative;
		height: var(--map-height);
		max-height: var(--map-max-height);
		z-index: 0;
	}

	.map-loading {
		position: absolute;
		background: #f2f2f2;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		pointer-events: all;
		z-index: 1;
		transition: opacity 0.2s ease;
		opacity: 1;

		&.loaded {
			opacity: 0;
			pointer-events: none;
		}
	}

	.ts-spinner {
		width: 40px;
		height: 40px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.ts-double-bounce1,
	.ts-double-bounce2 {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #333;
		opacity: 0.6;
		position: absolute;
		top: 0;
		left: 0;
		animation: sk-bounce 2s infinite ease-in-out;
	}

	.ts-double-bounce2 {
		animation-delay: -1s;
	}

	@keyframes sk-bounce {
		0%,
		100% {
			transform: scale(0);
			-webkit-transform: scale(0);
		}

		50% {
			transform: scale(1);
			-webkit-transform: scale(1);
		}
	}
</style>
