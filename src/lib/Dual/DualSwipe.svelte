<script>
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import Compare from '@maplibre/maplibre-gl-compare';
	import '../../../node_modules/maplibre-gl/dist/maplibre-gl.css';
	import '../../../node_modules/@maplibre/maplibre-gl-compare/dist/maplibre-gl-compare.css';

	let container, left, right, mapCompare;
	maplibregl.Compare = Compare;

	let currentPosition;

	const updatePosition = () => {
		currentPosition = mapCompare.currentPosition;
	};

	const load = () => {
		console.log('load', window);
		let initZoom = 6;
		let initCoords = [8.2, 46.7];

		// var beforeMap = new maplibregl.Map({
		// 	container: left,
		// 	style: 'https://demotiles.maplibre.org/style.json',
		// 	center: initCoords,
		// 	zoom: initZoom
		// });

		// var afterMap = new maplibregl.Map({
		// 	container: right,
		// 	style:
		// 		'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.leichte-basiskarte.vt/style.json',
		// 	center: initCoords,
		// 	zoom: initZoom
		// });

		// mapCompare = new maplibregl.Compare(beforeMap, afterMap, container, {});
		// mapCompare.on('slideend', () => {
		// 	// console.log(mapCompare.currentPosition)
		// 	updatePosition();
		// });
	};

	// onMount(() => {
	// 	load();
	// 	updatePosition();
	// });
	$: if (browser) {
		if (!window) {
			window = {};
		}

		window.maplibregl = maplibregl;
		load();
		// updatePosition();
	}
</script>

<code>{currentPosition}</code>
<div
	id="comparison-container"
	bind:this={container}
	on:pointerdown={() => {
		console.log('down');
		updatePosition;
	}}
>
	<div id="before" class="map" bind:this={left}></div>
	<div id="after" class="map" bind:this={right}></div>
</div>

<style>
	#comparison-container {
		position: relative;
		width: 100%;
		height: 600px;
		overflow: hidden;
	}
	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
	}
</style>
