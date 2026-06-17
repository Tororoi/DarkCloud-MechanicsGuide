// ============================================================
//  fishing.js — fishing simulation engine.
//  Pure functions ported from SimulatorScript.gs / WebApp.gs.
//  No DOM, no spreadsheet — all simulation runs in the browser.
// ============================================================

import { AREA_CONFIG, FISH_BY_ID, FISH_BY_NAME, PERIODS } from '../data/fish.js';

// ── Core formulas ─────────────────────────────────────────────

// Replicates ELF 0x00240D60 with confirmed RNG chain (fishSizeRng):
//   rngRoll = Irwin-Hall(12) - 6 = sum of 12 uniform[0,1) draws minus 6
//   range (-6,6), mean 0, std ≈ 1 (closely approximates N(0,1)).
// Asymmetric application: positive roll ÷4, negative roll ÷8.
// Clamped to [0.5*baseSize, maxSize].
export function simulateSlotInit(fish) {
	let rngRoll = 0;
	for (let i = 0; i < 12; i++) rngRoll += Math.random();
	rngRoll -= 6.0;

	const range = fish.maxSize - fish.baseSize;
	let size = fish.baseSize + (rngRoll * range) / (rngRoll >= 0 ? 4.0 : 8.0);
	const floor_ = 0.5 * fish.baseSize;
	if (size < floor_) size = floor_;
	if (size > fish.maxSize) size = fish.maxSize;
	return size;
}

// Replicates ELF 0x00240E80 — piecewise linear FP reward.
export function simulateFpReward(fish, size) {
	let reward;
	if (size < fish.baseSize) {
		reward = fish.baseSize > 0 ? (fish.baseFp * size) / fish.baseSize : 0;
	} else {
		const denom = fish.maxSize - fish.baseSize;
		reward = denom > 0
			? fish.baseFp + ((fish.maxFp - fish.baseFp) * (size - fish.baseSize)) / denom
			: fish.baseFp;
	}
	return Math.floor(reward);
}

// ── Spawn mechanisms ──────────────────────────────────────────

function spawnFourWayEqual(weights) {
	const ids = Object.keys(weights).map(Number);
	return ids[Math.floor(Math.random() * 4)];
}

function spawnThreeWayMod3(weights) {
	const ids = Object.keys(weights).map(Number);
	return ids[Math.floor(Math.random() * 3)];
}

function spawnRandomMod100(weights) {
	const roll = Math.random() * 100;
	let cum = 0;
	const entries = Object.entries(weights);
	for (const [idStr, w] of entries) {
		cum += w * 100;
		if (roll < cum) return parseInt(idStr, 10);
	}
	return parseInt(entries[entries.length - 1][0], 10);
}

// Rare pre-check wrapper (Matataki and Muska Lacka).
function spawnWithRareCheck(area, periodIdx, commonSpawnFn) {
	const divisor = area.rareDivisors[periodIdx];
	if (Math.floor(Math.random() * divisor) === 0) {
		// Rare branch: random % 5 == 0 → Baron Garayan (17), else → Mardan Garayan (5)
		return Math.floor(Math.random() * 5) === 0 ? 17 : 5;
	}
	return commonSpawnFn();
}

// Spawn one fish ID for a slot given area config and period index.
export function spawnFish(area, periodIdx) {
	const common = () => {
		switch (area.mechanism) {
			case 'fourWayEqual': return spawnFourWayEqual(area.commonWeights);
			case 'threeWayMod3': return spawnThreeWayMod3(area.commonWeights);
			case 'randomMod100': return spawnRandomMod100(area.commonWeights);
			default:             return spawnRandomMod100(area.commonWeights);
		}
	};
	if (area.rareDivisors) return spawnWithRareCheck(area, periodIdx, common);
	return common();
}

// ── Analytical (predicted) size distribution ──────────────────

// IH(12)-6 PDF — normal approximation N(0,1) (exact std for IH(12) is 1.0).
function ihPdf(x) {
	return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export function normalCdf(x) {
	const t = 1 / (1 + 0.2316419 * Math.abs(x));
	const d = 0.3989423 * Math.exp((-x * x) / 2);
	const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
	return x >= 0 ? 1 - p : p;
}

// Predicted per-cm probability mass for a fish's size distribution.
export function analyticalSizeDistribution(fish) {
	const base = fish.baseSize;
	const max_ = fish.maxSize;
	const floor_ = 0.5 * base;
	const range = max_ - base;
	const minCm = Math.floor(floor_ * 10);
	const maxCm = Math.ceil(max_ * 10);
	const probs = {};

	const rngAtFloor = ((floor_ - base) * 8) / range; // negative
	const rngAtMaxUp = ((max_ - base) * 4) / range;   // positive

	const pFloor = normalCdf(rngAtFloor);
	const pMax = 1 - normalCdf(rngAtMaxUp);

	for (let cm = minCm; cm <= maxCm; cm++) {
		const lo = cm / 10.0;
		const hi = (cm + 1) / 10.0;
		let p = 0;

		// Upper segment: size in [base, max_), rngRoll = (size - base) * 4 / range
		const upLo = Math.max(lo, base);
		const upHi = Math.min(hi, max_);
		if (upHi > upLo) {
			const rLo = ((upLo - base) * 4) / range;
			const rHi = ((upHi - base) * 4) / range;
			const steps = 20;
			for (let k = 0; k < steps; k++) {
				const r = rLo + ((rHi - rLo) * (k + 0.5)) / steps;
				p += (ihPdf(r) * (4 / range) * (upHi - upLo)) / steps;
			}
		}

		// Lower segment: size in [floor_, base), rngRoll = (size - base) * 8 / range
		const dnLo = Math.max(lo, floor_);
		const dnHi = Math.min(hi, base);
		if (dnHi > dnLo) {
			const rLo = ((dnLo - base) * 8) / range;
			const rHi = ((dnHi - base) * 8) / range;
			const steps = 20;
			for (let k = 0; k < steps; k++) {
				const r = rLo + ((rHi - rLo) * (k + 0.5)) / steps;
				p += (ihPdf(r) * (8 / range) * (dnHi - dnLo)) / steps;
			}
		}

		if (lo <= floor_ && floor_ < hi) p += pFloor;
		if (lo <= max_ && max_ < hi) p += pMax;

		probs[cm] = p;
	}
	return probs;
}

// ── High-level simulation runs (return plain data, no DOM) ────

// Effective per-slot spawn weight (used to order datasets rarest→common).
function effectiveWeight(areaConfig, id, periodIdx) {
	const cw = (areaConfig.commonWeights || {})[id] || 0;
	const rs = (areaConfig.rareSplits || {})[id] || 0;
	if (rs > 0 && areaConfig.rareDivisors) {
		const div = areaConfig.rareDivisors[periodIdx] || 25;
		return rs / div;
	}
	if (areaConfig.rareDivisors && cw > 0) {
		const div = areaConfig.rareDivisors[periodIdx] || 25;
		return cw * (1 - 1 / div);
	}
	return cw;
}

// Session simulator: Monte Carlo over N sessions in an area/period.
export function runSession({ areaName, periodName, numSessions }) {
	const area = AREA_CONFIG[areaName];
	if (!area) return { ok: false, message: 'Area not found: ' + areaName };
	const periodIdx = PERIODS.indexOf(periodName);
	const numSess = parseInt(numSessions, 10);
	if (isNaN(numSess) || numSess < 1) return { ok: false, message: 'Invalid session count' };

	const sizeByCm = {};
	const spawnCounts = {};
	const sizeMin = {};
	const sizeMax = {};

	for (let s = 0; s < numSess; s++) {
		for (let slot = 0; slot < area.slots; slot++) {
			const fishId = spawnFish(area, periodIdx);
			const fish = FISH_BY_ID[fishId];
			if (!fish) continue;
			const size = simulateSlotInit(fish);
			const cm = Math.round(size * 10);
			if (!sizeByCm[fishId]) sizeByCm[fishId] = {};
			if (!spawnCounts[fishId]) spawnCounts[fishId] = 0;
			sizeByCm[fishId][cm] = (sizeByCm[fishId][cm] || 0) + 1;
			if (sizeMin[fishId] === undefined || size < sizeMin[fishId]) sizeMin[fishId] = size;
			if (sizeMax[fishId] === undefined || size > sizeMax[fishId]) sizeMax[fishId] = size;
			spawnCounts[fishId]++;
		}
	}

	const totalSlots = numSess * area.slots;
	const fishIds = Object.keys(sizeByCm).map(Number).sort((a, b) => a - b);

	let globalMin = Infinity, globalMax = -Infinity;
	fishIds.forEach((id) => {
		const f = FISH_BY_ID[id];
		globalMin = Math.min(globalMin, Math.floor(f.minSize * 10));
		globalMax = Math.max(globalMax, Math.ceil(f.maxSize * 10));
	});
	const labels = [];
	for (let cm = globalMin; cm <= globalMax; cm++) labels.push(cm);

	const sortedIds = [...fishIds].sort(
		(a, b) => effectiveWeight(area, a, periodIdx) - effectiveWeight(area, b, periodIdx)
	);

	const summary = fishIds.map((id) => {
		const f = FISH_BY_ID[id];
		const n = spawnCounts[id] || 0;
		return {
			name: f.name,
			count: n,
			pct: ((n / totalSlots) * 100).toFixed(2) + '%',
			minSize: sizeMin[id] !== undefined ? (sizeMin[id] * 10).toFixed(1) + ' cm' : '—',
			maxSize: sizeMax[id] !== undefined ? (sizeMax[id] * 10).toFixed(1) + ' cm' : '—'
		};
	});

	return {
		ok: true,
		areaName, periodName, numSess, totalSlots,
		labels, sortedIds, fishIds, sizeByCm, spawnCounts,
		summary
	};
}

// Species simulator: Monte Carlo over N fish of one species.
export function runSpecies({ fish, numFish }) {
	const n = parseInt(numFish, 10);
	if (isNaN(n) || n < 1) return { ok: false, message: 'Invalid fish count' };

	const sizes = [];
	for (let i = 0; i < n; i++) sizes.push(simulateSlotInit(fish));

	const minCm = Math.floor(fish.minSize * 10);
	const maxCm = Math.ceil(fish.maxSize * 10);
	const counts = {};
	for (let cm = minCm; cm <= maxCm; cm++) counts[cm] = 0;
	sizes.forEach((s) => {
		const cm = Math.round(s * 10);
		if (cm >= minCm && cm <= maxCm) counts[cm] = (counts[cm] || 0) + 1;
	});
	const countAt = (sizeVal) => counts[Math.round(sizeVal * 10)] || 0;

	const labels = [];
	const barData = [];
	for (let cm = minCm; cm <= maxCm; cm++) {
		labels.push(cm);
		barData.push(counts[cm] || 0);
	}

	const probs = analyticalSizeDistribution(fish);
	const predData = labels.map((cm) => (probs[cm] || 0) * n);

	const sorted = [...sizes].sort((a, b) => a - b);
	const mean = sizes.reduce((s, v) => s + v, 0) / sizes.length;
	const median = sorted.length % 2 === 0
		? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
		: sorted[Math.floor(sorted.length / 2)];
	const minObs = sorted[0];
	const maxObs = sorted[sorted.length - 1];

	const stats = [
		['Predicted Min',     (fish.minSize * 10).toFixed(1) + ' cm', simulateFpReward(fish, fish.minSize), ''],
		['Predicted Max',     (fish.maxSize * 10).toFixed(1) + ' cm', simulateFpReward(fish, fish.maxSize), ''],
		['Observed Min Size', (minObs * 10).toFixed(1) + ' cm',       simulateFpReward(fish, minObs),       countAt(minObs)],
		['Observed Max Size', (maxObs * 10).toFixed(1) + ' cm',       simulateFpReward(fish, maxObs),       countAt(maxObs)],
		['Mean Size',         (mean * 10).toFixed(1) + ' cm',         simulateFpReward(fish, mean),         countAt(mean)],
		['Median Size',       (median * 10).toFixed(1) + ' cm',       simulateFpReward(fish, median),       countAt(median)],
		['Base Size',         (fish.baseSize * 10).toFixed(1) + ' cm', fish.baseFp,                         countAt(fish.baseSize)],
		['Sample Size',       n.toLocaleString() + ' fish',           '',                                   '']
	];

	return { ok: true, fish, numFish: n, labels, barData, predData, stats };
}

// FP calculator: exact reward for a given fish + size (cm).
export function runFp({ fish, sizeCm }) {
	const cm = parseFloat(sizeCm);
	if (isNaN(cm) || cm <= 0) return { ok: false, message: 'Invalid size' };

	const size = cm / 10.0;
	const fp = simulateFpReward(fish, size);
	const minFp = simulateFpReward(fish, fish.minSize);
	const maxFp = simulateFpReward(fish, fish.maxSize);
	const baseFp = fish.baseFp;
	const pct = (((fp - minFp) / (maxFp - minFp)) * 100).toFixed(1);

	return { ok: true, fp, minFp, maxFp, baseFp, pct: parseFloat(pct), fishName: fish.name, sizeCm: cm };
}

export { FISH_BY_NAME };
