<script>
	import { BAIT_NAMES, BAIT_RADIUS } from '$lib/data/fish.js';
</script>

<div class="card">
	<div class="card-header">🔑 Keys &amp; Legends</div>
	<div class="card-body legends">
		<!-- Color scales: one tidy stacked column of swatch keys -->
		<div class="legend-col scales">
			<div>
				<div class="legend-title">Size (×10 cm)</div>
				<div class="legend-swatches">
					<div style="background:#e3f2fd;color:#000">3 (min)</div>
					<div style="background:#a8d0ef;color:#000">6</div>
					<div style="background:#6baed6;color:#fff">10</div>
					<div style="background:#2c7bb6;color:#fff">16</div>
					<div style="background:#01205e;color:#fff">30 (max)</div>
				</div>
			</div>

			<div>
				<div class="legend-title">FP</div>
				<div class="legend-swatches">
					<div style="background:#ede8f8;color:#000">8 (min)</div>
					<div style="background:#c9a8e8;color:#000">20</div>
					<div style="background:#a66dd4;color:#fff">50</div>
					<div style="background:#7b3fbe;color:#fff">200</div>
					<div style="background:#8A2BE2;color:#fff">1000 (max)</div>
				</div>
			</div>

			<div>
				<div class="legend-title">Spawn Weight (×100%)</div>
				<div class="legend-swatches">
					<div style="background:#f5f5f5;color:#999">0</div>
					<div style="background:#fde8f5;color:#000">0.100</div>
					<div style="background:#f0a0d8;color:#000">0.200</div>
					<div style="background:#e060bb;color:#fff">0.333</div>
					<div style="background:#E236A2;color:#fff">0.400</div>
				</div>
			</div>
		</div>

		<div class="legend-col">
			<div>
				<div class="legend-title">Bait Affinity</div>
				<div class="legend-swatches">
					<div style="background:#ffcdd2;color:#999">0.0 None</div>
					<div style="background:#fff9c4;color:#000">0.2 Weak</div>
					<div style="background:#8bc34a;color:#000">0.5 Good</div>
					<div style="background:#4caf50;color:#fff">1.0 Best</div>
				</div>
			</div>

			<div class="legend-title" style="margin-top:14px">Bait Notice Radius</div>
			<div class="legend-note">
				Distance from which fish notice the equipped bait. A larger radius
				draws fish from farther away.
			</div>
			<div class="bait-radius">
				{#each BAIT_NAMES as b (b)}
					<div class="bait-pill">
						<span class="bait-pill-name">{b}</span>
						<span class="bait-pill-val">{BAIT_RADIUS[b]}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="legend-col">
			<div class="legend-title">Garayan Rare Spawn</div>
			<div class="legend-note">
				Before each slot: if (random % Divisor == 0) → rare branch.<br />
				Rare: if (random % 5 == 0) → Baron Garayan, else → Mardan Garayan.
			</div>
			<table class="mini-table">
				<thead>
					<tr>
						<th style="background:#37474f;color:#fff">Area</th>
						<th style="background:#fffde7;color:#000">Morning</th>
						<th style="background:#e0f2f1;color:#000">Afternoon</th>
						<th style="background:#ffe0b2;color:#000">Dusk</th>
						<th style="background:#ede7f6;color:#000">Night</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Matataki Waterfall</td>
						<td style="background:#fffde7;text-align:center">25</td>
						<td style="background:#e0f2f1;text-align:center">35</td>
						<td style="background:#ffe0b2;text-align:center">20</td>
						<td style="background:#ede7f6;text-align:center">50</td>
					</tr>
					<tr>
						<td>Muska Lacka Oasis</td>
						<td style="background:#fffde7;text-align:center">25</td>
						<td style="background:#e0f2f1;text-align:center">35</td>
						<td style="background:#ffe0b2;text-align:center">20</td>
						<td style="background:#ede7f6;text-align:center">50</td>
					</tr>
				</tbody>
			</table>
			<div class="legend-foot">
				P(Mardan)/slot = 4 / (5 × Divisor) &nbsp;|&nbsp; P(Baron)/slot = 1 / (5 × Divisor)
			</div>
		</div>

		<div class="legend-col">
			<div class="legend-title">Slots per Area</div>
			<table class="mini-table">
				<thead>
					<tr>
						<th style="background:#37474f;color:#fff">Area</th>
						<th style="background:#37474f;color:#fff">Slots</th>
					</tr>
				</thead>
				<tbody>
					<tr><td>Norune Pond</td><td style="text-align:center">4</td></tr>
					<tr><td>Matataki Waterfall</td><td style="text-align:center">5</td></tr>
					<tr><td>Peanut Pond</td><td style="text-align:center">5</td></tr>
					<tr><td>Queens Harbor</td><td style="text-align:center">5</td></tr>
					<tr><td>Muska Lacka Oasis</td><td style="text-align:center">4</td></tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	.legends {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 24px 32px;
		font-size: 12px;
	}
	.legend-col {
		display: flex;
		flex-direction: column;
	}
	/* The stacked color-scale keys */
	.legend-col.scales {
		gap: 14px;
	}
	.legend-title {
		font-weight: bold;
		margin-bottom: 6px;
	}
	.legend-swatches {
		display: flex;
		gap: 2px;
	}
	.legend-swatches > div {
		padding: 3px 8px;
		border-radius: 3px;
	}
	.legend-note {
		font-size: 11px;
		color: #555;
		margin-bottom: 6px;
		max-width: 320px;
	}
	.legend-foot {
		font-size: 10px;
		color: #666;
		margin-top: 4px;
	}
	.mini-table {
		border-collapse: collapse;
		font-size: 11px;
	}
	.mini-table th,
	.mini-table td {
		padding: 3px 8px;
		border-bottom: 1px solid #eee;
	}
	.bait-radius {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		max-width: 320px;
	}
	.bait-pill {
		display: flex;
		overflow: hidden;
		border-radius: 3px;
		border: 1px solid #c8e6c9;
	}
	.bait-pill-name {
		width: 52px;
		padding: 3px 6px;
		background: #e8f5e9;
		color: #1b5e20;
	}
	.bait-pill-val {
		width: 32px;
		padding: 3px 6px;
		background: #1b5e20;
		color: #fff;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}
</style>
