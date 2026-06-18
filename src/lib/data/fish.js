// ============================================================
//  fish.js — canonical fishing data (ported from the Apps Script
//  FISH_DATA / AREA_CONFIG constants). Single source of truth.
// ============================================================

export const BAIT_NAMES = [
	'Evy', 'Mimi', 'Prickly', 'Cherry', 'Peach', 'Bomb', 'Poison',
	'Banana', 'Carrot', 'Potato', 'Minon', 'Battan', 'Petite'
];

// Notice-radius copied into each fish slot when the matching bait is equipped.
// Values from the EE RAM bait detection-radius table (confirmed 2026-06-03).
// Keyed by BAIT_NAMES; a larger radius means fish notice the bait from farther.
export const BAIT_RADIUS = {
	Evy: 128.0, Mimi: 50.0, Prickly: 25.0, Cherry: 25.0, Peach: 25.0,
	Bomb: 25.0, Poison: 25.0, Banana: 25.0, Carrot: 25.0, Potato: 25.0,
	Minon: 25.0, Battan: 25.0, Petite: 25.0
};

export const PERIODS = ['Morning', 'Afternoon', 'Dusk', 'Night'];
export const PERIOD_COLORS = ['#fffde7', '#e0f2f1', '#ffe0b2', '#ede7f6'];

// baits object is keyed by the names in BAIT_NAMES.
export const FISH_DATA = [
	{ id: 0,  name: 'Bobo',           scaleDivisor: 17.0, baseSize: 10.0, minSize: 5.0, maxSize: 20.0, baseFp: 20,  maxFp: 50,   color: '#1565c0',
		baits: { Evy: 1.0, Mimi: 0.0, Prickly: 0.0, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.0, Minon: 0.0, Battan: 0.0, Petite: 0.0 } },
	{ id: 1,  name: 'Gobbler',        scaleDivisor: 19.5, baseSize: 8.0,  minSize: 4.0, maxSize: 16.0, baseFp: 10,  maxFp: 30,   color: '#e53935',
		baits: { Evy: 0.0, Mimi: 0.5, Prickly: 0.5, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.0, Minon: 0.5, Battan: 0.5, Petite: 1.0 } },
	{ id: 2,  name: 'Nonky',          scaleDivisor: 25.5, baseSize: 8.0,  minSize: 4.0, maxSize: 19.0, baseFp: 8,   maxFp: 25,   color: '#43a047',
		baits: { Evy: 0.0, Mimi: 0.5, Prickly: 0.5, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 1.0, Minon: 0.5, Battan: 0.5, Petite: 0.0 } },
	{ id: 3,  name: 'Kaiji',          scaleDivisor: 35.4, baseSize: 12.0, minSize: 6.0, maxSize: 24.0, baseFp: 30,  maxFp: 60,   color: '#fb8c00',
		baits: { Evy: 0.5, Mimi: 0.0, Prickly: 0.0, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.0, Minon: 0.0, Battan: 0.0, Petite: 1.0 } },
	{ id: 4,  name: 'Baku Baku',      scaleDivisor: 28.0, baseSize: 8.0,  minSize: 4.0, maxSize: 16.0, baseFp: 10,  maxFp: 40,   color: '#8e24aa',
		baits: { Evy: 0.0, Mimi: 0.5, Prickly: 0.5, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.0, Minon: 0.5, Battan: 0.5, Petite: 1.0 } },
	{ id: 5,  name: 'Mardan Garayan', scaleDivisor: 21.0, baseSize: 10.0, minSize: 5.0, maxSize: 16.0, baseFp: 200, maxFp: 400,  color: '#00897b',
		baits: { Evy: 0.0, Mimi: 0.0, Prickly: 0.0, Cherry: 0.0, Peach: 0.0, Bomb: 0.0, Poison: 1.0, Banana: 0.0, Carrot: 0.0, Potato: 0.0, Minon: 0.0, Battan: 0.0, Petite: 0.0 } },
	{ id: 6,  name: 'Gummy',          scaleDivisor: 20.0, baseSize: 6.0,  minSize: 3.0, maxSize: 12.0, baseFp: 15,  maxFp: 40,   color: '#f06292',
		baits: { Evy: 0.0, Mimi: 1.0, Prickly: 0.5, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.5, Minon: 0.5, Battan: 0.5, Petite: 0.0 } },
	{ id: 7,  name: 'Niler',          scaleDivisor: 20.0, baseSize: 6.0,  minSize: 3.0, maxSize: 10.0, baseFp: 20,  maxFp: 50,   color: '#fdd835',
		baits: { Evy: 0.0, Mimi: 0.5, Prickly: 1.0, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.5, Minon: 0.5, Battan: 0.5, Petite: 0.0 } },
	{ id: 9,  name: 'Umadakara',      scaleDivisor: 21.0, baseSize: 8.0,  minSize: 4.0, maxSize: 16.0, baseFp: 100, maxFp: 200,  color: '#6d4c41',
		baits: { Evy: 0.0, Mimi: 0.0, Prickly: 0.0, Cherry: 0.0, Peach: 0.0, Bomb: 0.0, Poison: 0.0, Banana: 0.0, Carrot: 1.0, Potato: 0.0, Minon: 0.0, Battan: 0.0, Petite: 0.0 } },
	{ id: 10, name: 'Tarton',         scaleDivisor: 20.0, baseSize: 8.0,  minSize: 4.0, maxSize: 16.0, baseFp: 40,  maxFp: 80,   color: '#00acc1',
		baits: { Evy: 0.0, Mimi: 0.5, Prickly: 0.5, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.5, Minon: 1.0, Battan: 0.5, Petite: 0.5 } },
	{ id: 11, name: 'Piccoly',        scaleDivisor: 20.0, baseSize: 6.0,  minSize: 3.0, maxSize: 12.0, baseFp: 20,  maxFp: 40,   color: '#546e7a',
		baits: { Evy: 1.0, Mimi: 0.5, Prickly: 0.5, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.0, Minon: 0.5, Battan: 0.5, Petite: 0.0 } },
	{ id: 12, name: 'Bon',            scaleDivisor: 15.0, baseSize: 6.0,  minSize: 3.0, maxSize: 12.0, baseFp: 10,  maxFp: 30,   color: '#ff7043',
		baits: { Evy: 1.0, Mimi: 0.5, Prickly: 0.5, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.0, Minon: 0.5, Battan: 0.5, Petite: 0.0 } },
	{ id: 13, name: 'Hamahama',       scaleDivisor: 21.0, baseSize: 10.0, minSize: 5.0, maxSize: 20.0, baseFp: 35,  maxFp: 70,   color: '#26a69a',
		baits: { Evy: 0.0, Mimi: 0.0, Prickly: 0.0, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.0, Minon: 0.0, Battan: 0.0, Petite: 1.0 } },
	{ id: 14, name: 'Negie',          scaleDivisor: 21.0, baseSize: 8.0,  minSize: 4.0, maxSize: 16.0, baseFp: 15,  maxFp: 40,   color: '#7cb342',
		baits: { Evy: 0.0, Mimi: 0.0, Prickly: 0.0, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 1.0, Minon: 0.5, Battan: 0.5, Petite: 0.0 } },
	{ id: 15, name: 'Den',            scaleDivisor: 20.0, baseSize: 8.0,  minSize: 4.0, maxSize: 20.0, baseFp: 20,  maxFp: 40,   color: '#ec407a',
		baits: { Evy: 0.0, Mimi: 0.0, Prickly: 0.0, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.5, Minon: 1.0, Battan: 0.5, Petite: 0.0 } },
	{ id: 16, name: 'Heela',          scaleDivisor: 20.0, baseSize: 8.0,  minSize: 4.0, maxSize: 14.0, baseFp: 20,  maxFp: 40,   color: '#5c6bc0',
		baits: { Evy: 0.0, Mimi: 0.0, Prickly: 0.0, Cherry: 0.2, Peach: 0.2, Bomb: 0.2, Poison: 0.0, Banana: 0.2, Carrot: 0.0, Potato: 0.5, Minon: 0.5, Battan: 1.0, Petite: 1.0 } },
	{ id: 17, name: 'Baron Garayan',  scaleDivisor: 21.0, baseSize: 10.0, minSize: 5.0, maxSize: 30.0, baseFp: 600, maxFp: 1000, color: '#8d6e63',
		baits: { Evy: 0.0, Mimi: 0.0, Prickly: 0.0, Cherry: 0.0, Peach: 0.0, Bomb: 0.0, Poison: 0.0, Banana: 0.0, Carrot: 0.0, Potato: 0.5, Minon: 0.0, Battan: 0.0, Petite: 0.0 } }
];

// Garayan rare-spawn fish ids.
export const GARAYAN_IDS = new Set([5, 17]);

// Area config with exact spawn weights from the ELF disassembly.
//   commonWeights : time-invariant per-fish fraction of common outcomes
//   rareDivisors  : [Morning, Afternoon, Dusk, Night] — rare branch fires when random % divisor === 0
//   rareSplits    : Mardan = 4/5, Baron = 1/5 of rare outcomes
// AREA_ORDER controls display order (matches the original sheet columns).
export const AREA_ORDER = [
	'Norune Pond', 'Matataki Waterfall', 'Peanut Pond', 'Queens Harbor', 'Muska Lacka Oasis'
];

export const AREA_CONFIG = {
	'Norune Pond':        { slots: 4, mechanism: 'fourWayEqual', commonWeights: { 1: 0.25, 2: 0.25, 6: 0.25, 7: 0.25 },                rareDivisors: null,            rareSplits: null },
	'Matataki Waterfall': { slots: 5, mechanism: 'threeWayMod3', commonWeights: { 2: 1 / 3, 4: 1 / 3, 6: 1 / 3 },                       rareDivisors: [25, 35, 20, 50], rareSplits: { 5: 0.8, 17: 0.2 } },
	'Peanut Pond':        { slots: 5, mechanism: 'randomMod100', commonWeights: { 1: 0.35, 4: 0.35, 9: 0.10, 10: 0.20 },               rareDivisors: null,            rareSplits: null },
	'Queens Harbor':      { slots: 5, mechanism: 'randomMod100', commonWeights: { 0: 0.20, 3: 0.20, 11: 0.20, 12: 0.20, 13: 0.20 },    rareDivisors: null,            rareSplits: null },
	'Muska Lacka Oasis':  { slots: 4, mechanism: 'randomMod100', commonWeights: { 14: 0.40, 15: 0.30, 16: 0.30 },                      rareDivisors: [25, 35, 20, 50], rareSplits: { 5: 0.8, 17: 0.2 } }
};

export const FISH_BY_ID = Object.fromEntries(FISH_DATA.map((f) => [f.id, f]));
export const FISH_BY_NAME = Object.fromEntries(FISH_DATA.map((f) => [f.name, f]));

// Default values for the editable "Custom Fish" entry used by the simulator.
export const CUSTOM_FISH_DEFAULTS = {
	name: 'Custom Fish',
	scaleDivisor: 21.0,
	baseSize: 10.0,
	minSize: 5.0,
	maxSize: 50.0,
	baseFp: 600,
	maxFp: 1000,
	color: '#1565c0'
};

// ── Spawn-weight display helper ───────────────────────────────
// Returns, for a given fish + area, how the spawn weight should be
// rendered in the Fish Stats table:
//   { kind: "single", weight }                  → one merged cell
//   { kind: "periods", values: [m, a, d, n] }   → four per-period cells (Garayan)
export function spawnWeightCells(fish, areaName) {
	const area = AREA_CONFIG[areaName];
	if (!area) return { kind: 'single', weight: 0 };

	if (GARAYAN_IDS.has(fish.id)) {
		if (!area.rareDivisors || !area.rareSplits || area.rareSplits[fish.id] === undefined) {
			return { kind: 'periods', values: [0, 0, 0, 0] };
		}
		const split = area.rareSplits[fish.id];
		return { kind: 'periods', values: area.rareDivisors.map((div) => split / div) };
	}

	const w = area.commonWeights[fish.id];
	return { kind: 'single', weight: w !== undefined ? w : 0 };
}
