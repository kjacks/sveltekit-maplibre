<script>
	import Map from "./Map.svelte";
	import BuildingsLayer from "./BuildingsLayer.svelte";


</script>

<!-- <button on:click={toggleTallBuildingVisibity}>{tallBuildingsVisible ? "Hide tall buildings" : "Show tall buildings"}</button> -->


<Map>
	<BuildingsLayer />
</Map>