<div class="card">
	<div class="card-header">🔑 Keys &amp; Legends</div>
	<div class="card-body legends">
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
			<div class="legend-title">Bait Affinity</div>
			<div class="legend-swatches">
				<div style="background:#ffcdd2;color:#999">0.0 None</div>
				<div style="background:#fff9c4;color:#000">0.2 Weak</div>
				<div style="background:#8bc34a;color:#000">0.5 Good</div>
				<div style="background:#4caf50;color:#fff">1.0 Best</div>
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

		<div style="min-width:340px">
			<div class="legend-title">Garayan Rare Spawn</div>
			<div class="garayan-note">
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
			<div class="garayan-foot">
				P(Mardan)/slot = 4 / (5 × Divisor) &nbsp;|&nbsp; P(Baron)/slot = 1 / (5 × Divisor)
			</div>
		</div>

		<div>
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
		gap: 24px;
		font-size: 12px;
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
	.garayan-note {
		font-size: 11px;
		color: #555;
		margin-bottom: 6px;
	}
	.garayan-foot {
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
</style>
