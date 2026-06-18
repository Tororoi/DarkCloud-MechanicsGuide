<script>
	import { FISH_DATA, FISH_BY_NAME, AREA_ORDER, PERIODS } from '$lib/data/fish.js';
	import { hexToRgba } from '$lib/color.js';
	import {
		runSession, runSpecies, runFp, normalCdf, predictedProbs,
		ARISE_STRENGTH, ARISE_EXPONENT
	} from '$lib/sim/fishing.js';
	import { customFish } from '$lib/fishingState.svelte.js';
	import ChartCanvas from '$lib/components/ChartCanvas.svelte';

	const fishNames = [...FISH_DATA.map((f) => f.name), 'Custom Fish'];
	const fishById = Object.fromEntries(FISH_DATA.map((f) => [f.id, f]));

	function getFish(name) {
		if (name !== 'Custom Fish') return FISH_BY_NAME[name];
		// Inputs bind as strings (text fields) — coerce to numbers so the size
		// formula does arithmetic, not string concatenation.
		return {
			name: 'Custom Fish',
			color: customFish.color,
			scaleDivisor: Number(customFish.scaleDivisor) || 0,
			baseSize: Number(customFish.baseSize) || 0,
			minSize: Number(customFish.minSize) || 0,
			maxSize: Number(customFish.maxSize) || 0,
			baseFp: Number(customFish.baseFp) || 0,
			maxFp: Number(customFish.maxFp) || 0
		};
	}

	// ── Tab + form state ──
	let tab = $state('session');

	let sessArea = $state(AREA_ORDER[0]);
	let sessPeriod = $state('Morning');
	let sessCount = $state(100);

	let specFish = $state(FISH_DATA[0].name);
	let specCount = $state(1000);

	let fpFish = $state(FISH_DATA[0].name);
	let fpSize = $state(100);
	let fpResult = $state(null);

	// Arise Mardan (romhack) size smoothing — shared across Session & Species.
	// On/off; the buff strength/shape are locked constants (ARISE_STRENGTH/EXPONENT).
	let arise = $state({ enabled: false });

	// ── Modal state ──
	let modal = $state({ open: false, title: '', mode: 'loading', data: null, error: '' });
	let zoom = $state(1);

	function closeModal() {
		modal = { ...modal, open: false };
	}
	function onKey(e) {
		if (e.key === 'Escape') closeModal();
	}

	// ── Session chart data ──
	const sessionChartData = $derived.by(() => {
		if (modal.mode !== 'session' || !modal.data) return null;
		const { labels, sortedIds, sizeByCm, spawnCounts } = modal.data;
		const datasets = [];
		sortedIds.forEach((id) => {
			const f = fishById[id];
			const counts = sizeByCm[id] || {};
			datasets.push({
				type: 'bar',
				label: f.name,
				data: labels.map((cm) => counts[cm] || 0),
				backgroundColor: hexToRgba(f.color, 0.4),
				borderColor: hexToRgba(f.color, 0.8),
				borderWidth: 0,
				stack: 'mc',
				order: 2
			});
		});
		const ar = modal.data.arise;
		sortedIds.forEach((id) => {
			const f = fishById[id];
			const n = spawnCounts[id] || 0;
			const probs = predictedProbs(f, ar);
			datasets.push({
				type: 'line',
				label: f.name + ' (predicted)',
				data: labels.map((cm) => (probs[cm] || 0) * n),
				borderColor: hexToRgba(f.color, 1.0),
				backgroundColor: 'transparent',
				borderWidth: 2,
				pointRadius: 0,
				tension: 0.4,
				order: 1
			});
		});
		return { labels, datasets };
	});

	const sessionFullMax = $derived.by(() => {
		if (!sessionChartData) return 0;
		const bars = sessionChartData.datasets.filter((d) => d.type === 'bar');
		return Math.max(
			0,
			...sessionChartData.labels.map((_, i) => bars.reduce((s, d) => s + (d.data[i] || 0), 0))
		);
	});

	const sessionOptions = $derived({
		responsive: true,
		interaction: { mode: 'index', intersect: false },
		plugins: {
			legend: {
				position: 'top',
				labels: { boxWidth: 12, font: { size: 11 }, filter: (item) => !item.text.includes('(predicted)') }
			}
		},
		scales: {
			x: { title: { display: true, text: 'Size (cm)' }, ticks: { maxTicksLimit: 40 } },
			y: {
				stacked: true,
				title: { display: true, text: 'Count' },
				beginAtZero: true,
				max: zoom === 1 ? undefined : Math.ceil(sessionFullMax / zoom),
				ticks: { maxTicksLimit: 6 }
			}
		}
	});

	// ── Species chart data ──
	const speciesChartData = $derived.by(() => {
		if (modal.mode !== 'species' || !modal.data) return null;
		const { fish, labels, barData, predData } = modal.data;
		const color = fish.color || '#1565c0';
		return {
			labels,
			datasets: [
				{
					type: 'bar',
					label: fish.name,
					data: barData,
					backgroundColor: hexToRgba(color, 0.5),
					borderColor: hexToRgba(color, 0.85),
					borderWidth: 1
				},
				{
					type: 'line',
					label: fish.name + ' (predicted)',
					data: predData,
					borderColor: '#1a1a1a',
					backgroundColor: 'transparent',
					borderWidth: 3,
					pointRadius: 0,
					tension: 0,
					order: 0
				}
			]
		};
	});

	const speciesOptions = {
		responsive: true,
		interaction: { mode: 'index', intersect: false },
		plugins: { legend: { position: 'top', labels: { boxWidth: 12, filter: (item) => item.datasetIndex === 0 } } },
		scales: {
			x: { title: { display: true, text: 'Size (cm)' }, ticks: { maxTicksLimit: 40 } },
			y: { title: { display: true, text: 'Count' }, beginAtZero: true }
		}
	};

	function formulaHtml(fish, arise) {
		const b = fish.baseSize, mn = fish.minSize, mx = fish.maxSize, r = mx - b, fl = b * 0.5;
		const head = `<strong>Fish stats:</strong>
			BaseSize=${b} | MinSize=${mn} | MaxSize=${mx} | Range=${r} | BaseFP=${fish.baseFp} | MaxFP=${fish.maxFp}<br>
			<strong>RNG:</strong> r &sim; IH(12)&minus;6 &nbsp; (range (&minus;6,6), mean=0, &sigma;=1)<br>`;

		if (arise && arise.enabled) {
			return `${head}
				<strong>Arise Mardan smoothing:</strong> size-based buff, t = (size&minus;Base)/(Max&minus;Base)<br>
				size → size + ${ARISE_STRENGTH}&middot;(Max&minus;Base)&middot;t<sup>${ARISE_EXPONENT}</sup>&middot;(1&minus;t) &nbsp; (upper range only)<br>
				<strong>Effect:</strong> fish only get bigger; Max is preserved (no probability pulled from it); mid/high sizes buffed up to fill the gradient into Max`;
		}

		const rngFloor = (((fl - b) * 8) / r).toFixed(2);
		const rngMaxUp = (((mx - b) * 4) / r).toFixed(2);
		return `${head}
			<strong>Size:</strong> BaseSize + r &times; Range / {4 if r&ge;0, 8 if r&lt;0} &nbsp; clamped to [${fl}, ${mx}]<br>
			<strong>Floor clamp:</strong> r &lt; ${rngFloor} (P&asymp;${(100 * normalCdf(parseFloat(rngFloor))).toFixed(3)}%)
			&nbsp;&nbsp;
			<strong>Max clamp:</strong> r &gt; ${rngMaxUp} (P&asymp;${(100 * (1 - normalCdf(parseFloat(rngMaxUp)))).toFixed(3)}%)`;
	}

	// ── Actions ──
	function generateSession() {
		modal = { open: true, title: 'Session Simulator — ' + sessArea, mode: 'loading', data: null, error: '' };
		zoom = 1;
		setTimeout(() => {
			const result = runSession({
				areaName: sessArea,
				periodName: sessPeriod,
				numSessions: sessCount,
				arise: { enabled: arise.enabled }
			});
			if (!result.ok) modal = { ...modal, mode: 'error', error: result.message };
			else modal = { open: true, title: 'Session Simulator — ' + sessArea, mode: 'session', data: result, error: '' };
		}, 20);
	}

	function generateSpecies() {
		const fish = getFish(specFish);
		modal = { open: true, title: 'Species Simulator — ' + specFish, mode: 'loading', data: null, error: '' };
		setTimeout(() => {
			const result = runSpecies({
				fish,
				numFish: specCount,
				arise: { enabled: arise.enabled }
			});
			if (!result.ok) modal = { ...modal, mode: 'error', error: result.message };
			else modal = { open: true, title: 'Species Simulator — ' + specFish, mode: 'species', data: result, error: '' };
		}, 20);
	}

	function calculateFp() {
		const fish = getFish(fpFish);
		fpResult = runFp({ fish, sizeCm: fpSize });
	}
</script>

<svelte:window onkeydown={onKey} />

{#snippet ariseControl()}
	<div class="sim-row arise-row">
		<label class="arise-label">
			<input type="checkbox" bind:checked={arise.enabled} />
			Arise Mardan smoothing
		</label>
	</div>
{/snippet}

<div class="card">
	<div class="card-header">🎣 Fishing Simulator</div>
	<div class="card-body">
		<div class="sim-tabs">
			<button class="sim-tab" class:active={tab === 'session'} onclick={() => (tab = 'session')}>Session Simulator</button>
			<button class="sim-tab" class:active={tab === 'species'} onclick={() => (tab = 'species')}>Species Simulator</button>
			<button class="sim-tab" class:active={tab === 'fp'} onclick={() => (tab = 'fp')}>FP Calculator</button>
		</div>

		{#if tab === 'session'}
			<div class="sim-panel">
				<div class="sim-row">
					<label for="sess-area">Area</label>
					<select id="sess-area" class="sim-select" bind:value={sessArea}>
						{#each AREA_ORDER as a (a)}<option>{a}</option>{/each}
					</select>
				</div>
				<div class="sim-row">
					<label for="sess-period">Time Period</label>
					<select id="sess-period" class="sim-select" bind:value={sessPeriod}>
						{#each PERIODS as p (p)}<option>{p}</option>{/each}
					</select>
				</div>
				<div class="sim-row">
					<label for="sess-count">Sessions</label>
					<input id="sess-count" class="sim-input" type="number" min="1" max="100000" bind:value={sessCount} />
				</div>
				{@render ariseControl()}
				<button class="generate-btn" onclick={generateSession}>▶ Generate</button>
			</div>
		{:else if tab === 'species'}
			<div class="sim-panel">
				<div class="sim-row">
					<label for="spec-fish">Fish</label>
					<select id="spec-fish" class="sim-select" bind:value={specFish}>
						{#each fishNames as n (n)}<option value={n}>{n}</option>{/each}
					</select>
				</div>
				<div class="sim-row">
					<label for="spec-count">Number of Fish</label>
					<input id="spec-count" class="sim-input" type="number" min="1" max="500000" bind:value={specCount} />
				</div>
				{@render ariseControl()}
				<button class="generate-btn" onclick={generateSpecies}>▶ Generate</button>
			</div>
		{:else}
			<div class="sim-panel">
				<div class="sim-row">
					<label for="fp-fish">Fish</label>
					<select id="fp-fish" class="sim-select" bind:value={fpFish}>
						{#each fishNames as n (n)}<option value={n}>{n}</option>{/each}
					</select>
				</div>
				<div class="sim-row">
					<label for="fp-size">Size (cm)</label>
					<input id="fp-size" class="sim-input" type="number" min="1" bind:value={fpSize} />
				</div>
				<button class="generate-btn" onclick={calculateFp}>▶ Calculate</button>

				{#if fpResult}
					<div class="fp-result">
						{#if !fpResult.ok}
							<div class="error-msg">{fpResult.message}</div>
						{:else}
							<div
								class="fp-val"
								style:color={fpResult.pct > 80 ? '#2e7d32' : fpResult.pct < 20 ? '#c62828' : 'var(--navy)'}
							>
								{fpResult.fp} FP
							</div>
							<div class="fp-sub">
								{fpResult.fishName} at {fpResult.sizeCm}cm &nbsp;|&nbsp;
								{fpResult.pct}% of max &nbsp;|&nbsp;
								Range: {fpResult.minFp} – {fpResult.maxFp} FP &nbsp;|&nbsp;
								Base FP: {fpResult.baseFp}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<!-- Result modal -->
{#if modal.open}
	<div
		class="modal-overlay"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeModal();
		}}
	>
		<div class="modal" role="dialog" aria-modal="true">
			<div class="modal-header">
				<h2>{modal.title}</h2>
				<button class="modal-close" onclick={closeModal} aria-label="Close">✕</button>
			</div>
			<div class="modal-body">
				{#if modal.mode === 'loading'}
					<div class="loading">Running simulation…</div>
				{:else if modal.mode === 'error'}
					<div class="error-msg">Error: {modal.error}</div>
				{:else if modal.mode === 'session' && sessionChartData}
					<div class="modal-sub">
						{modal.data.periodName} · {modal.data.numSess} sessions · stacked bars = Monte Carlo · lines = predicted{#if modal.data.arise?.enabled} · <strong>Arise Mardan smoothing</strong>{/if}
					</div>
					<div class="chart-row">
						<div class="chart-wrap">
							<ChartCanvas type="bar" data={sessionChartData} options={sessionOptions} />
						</div>
						<div class="zoom-col">
							<input class="zoom-range" type="range" min="1" max="100" bind:value={zoom} aria-label="Zoom Y axis" />
							<span class="zoom-lbl">{zoom}x</span>
						</div>
					</div>
					<table class="result-table">
						<thead>
							<tr>
								<th>Fish</th>
								<th style="text-align:right">Spawns</th>
								<th style="text-align:right">% of Slots</th>
								<th style="text-align:right">Min Size</th>
								<th style="text-align:right">Max Size</th>
							</tr>
						</thead>
						<tbody>
							{#each modal.data.summary as r (r.name)}
								<tr>
									<td>{r.name}</td>
									<td style="text-align:right">{r.count}</td>
									<td style="text-align:right">{r.pct}</td>
									<td style="text-align:right">{r.minSize}</td>
									<td style="text-align:right">{r.maxSize}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{:else if modal.mode === 'species' && speciesChartData}
					<div class="modal-sub">
						n = {modal.data.numFish.toLocaleString()} · bars = Monte Carlo · line = predicted{#if modal.data.arise?.enabled} · <strong>Arise Mardan smoothing</strong>{/if}
					</div>
					<ChartCanvas type="bar" data={speciesChartData} options={speciesOptions} />
					<!-- eslint-disable-next-line svelte/no-at-html-tags (our own generated, trusted string) -->
					<div class="formula-box">{@html formulaHtml(modal.data.fish, modal.data.arise)}</div>
					<table class="result-table">
						<thead>
							<tr><th>Statistic</th><th>Value</th><th>FP</th><th>Count</th></tr>
						</thead>
						<tbody>
							{#each modal.data.stats as row, i (i)}
								<tr>
									<td style="font-weight:bold">{row[0]}</td>
									<td>{row[1]}</td>
									<td>{row[2]}</td>
									<td>{row[3] !== '' && row[3] !== undefined ? row[3] : ''}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.sim-tabs {
		display: flex;
		border-bottom: 2px solid #e0e0e0;
	}
	.sim-tab {
		padding: 8px 20px;
		cursor: pointer;
		font-weight: bold;
		font-size: 13px;
		color: #666;
		border: none;
		background: none;
		border-bottom: 3px solid transparent;
		margin-bottom: -2px;
		transition: all 0.15s;
	}
	.sim-tab.active {
		color: var(--navy);
		border-bottom-color: var(--navy);
	}
	.sim-tab:hover:not(.active) {
		color: #333;
		background: #f5f5f5;
	}
	.sim-panel {
		padding: 16px 0;
	}
	.sim-row {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 10px;
		flex-wrap: wrap;
	}
	.sim-row label {
		font-weight: bold;
		min-width: 130px;
	}
	.sim-select,
	.sim-input {
		padding: 6px 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 13px;
		min-width: 180px;
		background: #fff;
	}
	.sim-select:focus,
	.sim-input:focus {
		outline: 2px solid var(--blue);
		border-color: var(--blue);
	}
	.arise-row {
		gap: 16px;
		padding: 8px 12px;
		background: #f3f6fb;
		border: 1px solid #dbe4f0;
		border-radius: 5px;
	}
	.arise-label {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: auto;
		cursor: pointer;
	}
	.arise-label input {
		width: 16px;
		height: 16px;
		cursor: pointer;
	}
	.arise-factor {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: bold;
	}
	.factor-input {
		min-width: 80px;
		width: 80px;
	}
	.generate-btn {
		background: var(--orange);
		color: #fff;
		border: none;
		border-radius: 5px;
		padding: 10px 28px;
		font-size: 14px;
		font-weight: bold;
		cursor: pointer;
		margin-top: 8px;
		transition: background 0.15s;
	}
	.generate-btn:hover {
		background: #bf360c;
	}
	.fp-result {
		margin-top: 12px;
		padding: 12px 16px;
		background: var(--light);
		border-radius: 5px;
		font-size: 14px;
	}
	.fp-val {
		font-size: 28px;
		font-weight: bold;
	}
	.fp-sub {
		font-size: 12px;
		color: #666;
		margin-top: 4px;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.modal {
		background: #fafafa;
		border-radius: 8px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		width: 90vw;
		max-width: 920px;
		max-height: 92vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.modal-header {
		background: var(--navy);
		color: #fff;
		padding: 12px 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-shrink: 0;
	}
	.modal-header h2 {
		font-size: 16px;
	}
	.modal-close {
		background: none;
		border: none;
		color: #fff;
		font-size: 22px;
		cursor: pointer;
		line-height: 1;
		padding: 0 4px;
	}
	.modal-close:hover {
		color: #ffcdd2;
	}
	.modal-body {
		padding: 16px;
		overflow-y: auto;
		flex: 1;
	}
	.modal-sub {
		color: #666;
		font-size: 12px;
		margin-bottom: 10px;
	}
	.chart-row {
		display: flex;
		gap: 8px;
		align-items: stretch;
	}
	.chart-wrap {
		flex: 1;
		min-width: 0;
	}
	.zoom-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 28px;
		padding: 30px 0 44px;
	}
	.zoom-range {
		writing-mode: vertical-rl;
		direction: rtl;
		width: 100%;
		flex: 1;
		accent-color: #00897b;
		cursor: pointer;
	}
	.zoom-lbl {
		font-size: 10px;
		color: #555;
		font-weight: bold;
		margin-top: 4px;
	}
	.formula-box {
		font-size: 11px;
		color: #555;
		margin: 10px 0;
		padding: 8px 10px;
		background: #f5f5f5;
		border-left: 3px solid #999;
		border-radius: 2px;
		line-height: 1.8;
	}
	.loading {
		text-align: center;
		color: #888;
		padding: 24px;
		font-style: italic;
	}
	.error-msg {
		color: #c62828;
		padding: 12px;
		background: #ffebee;
		border-radius: 4px;
	}
</style>
