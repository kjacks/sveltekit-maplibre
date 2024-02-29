<script>
	import Map from "./Map.svelte";
	// import GeometryLayer from "./GeometryLayer.svelte";
	import BuildingsLayer from "./BuildingsLayer.svelte";


</script>

<!-- <button on:click={toggleTallBuildingVisibity}>{tallBuildingsVisible ? "Hide tall buildings" : "Show tall buildings"}</button> -->


<Map config={{ center: [13.4050, 52.5200], zoom: 12 }}>
	<!-- <GeometryLayer /> -->
	<BuildingsLayer />
</Map>