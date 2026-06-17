<script>
	import Legends from '$lib/components/fishing/Legends.svelte';
	import FishStatsTable from '$lib/components/fishing/FishStatsTable.svelte';
	import Simulator from '$lib/components/fishing/Simulator.svelte';
</script>

<svelte:head>
	<title>Fishing — Dark Cloud Mechanics Guide</title>
</svelte:head>

<div class="page">
	<div class="page-intro">
		<h1>🎣 Fishing</h1>
		<p>
			Species data, spawn weights, bait affinities, and an in-browser size-distribution simulator.
			All formulas are reverse-engineered from the game's code (size = Irwin-Hall(12)−6 RNG;
			piecewise-linear FP reward).
		</p>
	</div>

	<Legends />

	<div class="card">
		<div class="card-header">📊 Fish Stats</div>
		<div class="card-body">
			<p class="hint">
				The blue <strong>Custom Fish</strong> row is editable — change its values to test a custom
				fish in the simulator below.
			</p>
			<FishStatsTable />
		</div>
	</div>

	<Simulator />
</div>

<style>
	.hint {
		font-size: 11px;
		color: #777;
		margin-bottom: 10px;
	}
</style>
