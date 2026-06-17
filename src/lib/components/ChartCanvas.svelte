<script>
	import { onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';

	let { type = 'bar', data, options } = $props();

	let canvas;
	let chart;

	$effect(() => {
		// Chart.js mutates the data object internally (defineProperty on datasets),
		// which is illegal on Svelte $state proxies. Hand it a plain deep clone.
		const plainData = $state.snapshot(data);

		if (!chart) {
			chart = new Chart(canvas.getContext('2d'), { type, data: plainData, options });
		} else {
			chart.data = plainData;
			if (options) chart.options = options;
			// 'none' = no animation → instant re-render (e.g. the y-axis zoom slider).
			chart.update('none');
		}
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		width: 100% !important;
	}
</style>
