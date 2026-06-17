<script>
	import {
		FISH_DATA, BAIT_NAMES, AREA_ORDER, PERIOD_COLORS, spawnWeightCells
	} from '$lib/data/fish.js';
	import { isLight, sizeColor, fpColor, spawnWeightColor, baitColor } from '$lib/color.js';
	import { customFish } from '$lib/fishingState.svelte.js';

	const statHeads = ['Name', 'Scale Div', 'Base Size', 'Min Size', 'Max Size', 'Base FP', 'Max FP'];

	function fmtNum(v) {
		if (v === null || v === undefined || v === '') return '';
		const n = parseFloat(v);
		return Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/\.?0+$/, '');
	}
	// Build "background:..;color:.." from a [bg, fg] pair.
	function style([bg, fg]) {
		return `background:${bg};color:${fg}`;
	}
	function nameStyle(color) {
		return `background:${color};color:${isLight(color) ? '#000' : '#fff'};font-weight:bold`;
	}

	// Validate numeric input: strip anything that isn't a digit (and, when allowed,
	// a single decimal point) so only numbers can be entered.
	function onNumInput(e, key, allowDecimal = true) {
		let v = e.currentTarget.value.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, '');
		if (allowDecimal) {
			const parts = v.split('.');
			if (parts.length > 2) v = parts[0] + '.' + parts.slice(1).join('');
		}
		customFish[key] = v;
		e.currentTarget.value = v; // reflect the sanitized value immediately
	}
</script>

<div class="stats-scroll">
	<table class="fish-stats">
		<thead>
			<tr>
				{#each statHeads as h (h)}
					<th rowspan="2">{h}</th>
				{/each}
				<th colspan={BAIT_NAMES.length} style="background:#1b5e20">Bait Affinities</th>
				<th colspan={AREA_ORDER.length * 4} style="background:#1a237e">Spawn Weights per Area</th>
			</tr>
			<tr>
				{#each BAIT_NAMES as b (b)}
					<th style="background:#1b5e20">{b}</th>
				{/each}
				{#each AREA_ORDER as a (a)}
					<th colspan="4" style="background:#1a237e">{a}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each FISH_DATA as f (f.id)}
				<tr>
					<td style={nameStyle(f.color)}>{f.name}</td>
					<td>{fmtNum(f.scaleDivisor)}</td>
					<td style={style(sizeColor(f.baseSize))}>{fmtNum(f.baseSize)}</td>
					<td style={style(sizeColor(f.minSize))}>{fmtNum(f.minSize)}</td>
					<td style={style(sizeColor(f.maxSize))}>{fmtNum(f.maxSize)}</td>
					<td style={style(fpColor(f.baseFp))}>{f.baseFp}</td>
					<td style={style(fpColor(f.maxFp))}>{f.maxFp}</td>

					{#each BAIT_NAMES as b (b)}
						<td style={style(baitColor(f.baits[b] || 0))}>{f.baits[b] || 0}</td>
					{/each}

					{#each AREA_ORDER as a (a)}
						{@const sw = spawnWeightCells(f, a)}
						{#if sw.kind === 'periods'}
							{#each sw.values as w, pi (pi)}
								{#if w > 0}
									<td class="spawn-period" style="background:{PERIOD_COLORS[pi]};color:#000">{w.toFixed(4)}</td>
								{:else}
									<td class="spawn-zero">0</td>
								{/if}
							{/each}
						{:else}
							<td colspan="4" style="{style(spawnWeightColor(sw.weight))};text-align:center">
								{sw.weight > 0 ? sw.weight.toFixed(3) : '0'}
							</td>
						{/if}
					{/each}
				</tr>
			{/each}

			<!-- Editable Custom Fish row -->
			<tr class="custom-row">
				<td class="custom-name">Custom Fish</td>
				<td><input class="custom-input" type="text" inputmode="decimal" value={customFish.scaleDivisor} oninput={(e) => onNumInput(e, 'scaleDivisor')} /></td>
				<td style={style(sizeColor(customFish.baseSize))}>
					<input class="custom-input" type="text" inputmode="decimal" value={customFish.baseSize} oninput={(e) => onNumInput(e, 'baseSize')} />
				</td>
				<td style={style(sizeColor(customFish.minSize))}>
					<input class="custom-input" type="text" inputmode="decimal" value={customFish.minSize} oninput={(e) => onNumInput(e, 'minSize')} />
				</td>
				<td style={style(sizeColor(customFish.maxSize))}>
					<input class="custom-input" type="text" inputmode="decimal" value={customFish.maxSize} oninput={(e) => onNumInput(e, 'maxSize')} />
				</td>
				<td style={style(fpColor(customFish.baseFp))}>
					<input class="custom-input" type="text" inputmode="numeric" value={customFish.baseFp} oninput={(e) => onNumInput(e, 'baseFp', false)} />
				</td>
				<td style={style(fpColor(customFish.maxFp))}>
					<input class="custom-input" type="text" inputmode="numeric" value={customFish.maxFp} oninput={(e) => onNumInput(e, 'maxFp', false)} />
				</td>
				{#each BAIT_NAMES as b (b)}
					<td class="custom-dash">—</td>
				{/each}
				{#each AREA_ORDER as a (a)}
					<td colspan="4" class="custom-dash" style="text-align:center">—</td>
				{/each}
			</tr>
		</tbody>
	</table>
</div>

<style>
	.stats-scroll {
		overflow-x: auto;
		max-width: 100%;
		padding-bottom: 18px;
	}
	table.fish-stats {
		border-collapse: collapse;
		font-size: 11px;
		width: auto;
	}
	table.fish-stats th {
		background: var(--gray);
		color: #fff;
		padding: 5px 4px;
		text-align: center;
		white-space: nowrap;
	}
	table.fish-stats td {
		padding: 3px 4px;
		border-bottom: 1px solid #eee;
		white-space: nowrap;
		text-align: center;
	}
	table.fish-stats td:first-child {
		text-align: left;
		font-weight: bold;
	}
	table.fish-stats tbody tr:hover td {
		filter: brightness(0.95);
	}
	.spawn-period {
		font-size: 10px;
	}
	.spawn-zero {
		background: #f5f5f5;
		color: #aaa;
	}
	.custom-row td {
		background: #e3f2fd !important;
	}
	.custom-dash {
		color: #888;
	}
	.custom-name {
		color: #000;
		font-weight: bold;
	}
	.custom-input {
		width: 60px;
		border: 1px solid #90caf9;
		border-radius: 3px;
		padding: 2px 4px;
		font-size: 11px;
		text-align: center;
		background: #fff;
		color: #000;
	}
</style>
