// ============================================================
//  color.js — color-scale helpers ported from the Apps Script.
//  These derive cell colors directly from the data.
// ============================================================

export function isLight(hex) {
	if (!hex || hex === 'white' || hex === '#ffffff') return true;
	try {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return (r * 299 + g * 587 + b * 114) / 1000 > 128;
	} catch (e) {
		return true;
	}
}

// Linear interpolate between two hex colors.
export function lerp(hex1, hex2, t) {
	const r1 = parseInt(hex1.slice(1, 3), 16), g1 = parseInt(hex1.slice(3, 5), 16), b1 = parseInt(hex1.slice(5, 7), 16);
	const r2 = parseInt(hex2.slice(1, 3), 16), g2 = parseInt(hex2.slice(3, 5), 16), b2 = parseInt(hex2.slice(5, 7), 16);
	const r = Math.round(r1 + (r2 - r1) * t);
	const g = Math.round(g1 + (g2 - g1) * t);
	const b = Math.round(b1 + (b2 - b1) * t);
	return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}

export function hexToRgba(hex, alpha) {
	try {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
	} catch (e) {
		return 'rgba(21,101,192,' + alpha + ')';
	}
}

// Each returns [background, foreground] matching the original sheet styling.

// Size: blue gradient with sqrt curve — #e3f2fd (3) → #01205e (30)
export function sizeColor(v) {
	const norm = Math.min(Math.max((v - 3) / (30 - 3), 0), 1.0);
	const t = Math.sqrt(norm);
	const bg = lerp('#e3f2fd', '#01205e', t);
	return [bg, t > 0.55 ? '#ffffff' : '#000000'];
}

// FP: purple gradient with log10 curve — #ede8f8 (8) → #8A2BE2 (1000)
export function fpColor(v) {
	const logMin = Math.log10(8);
	const logMax = Math.log10(1000);
	const t = Math.min(Math.max((Math.log10(Math.max(v, 8)) - logMin) / (logMax - logMin), 0), 1.0);
	const bg = lerp('#ede8f8', '#8A2BE2', t);
	return [bg, t > 0.55 ? '#ffffff' : '#000000'];
}

// Spawn weight: 0 = gray, >0 = pink gradient #fde8f5 → #E236A2 (cap at 0.4)
export function spawnWeightColor(w) {
	if (w <= 0) return ['#f5f5f5', '#999999'];
	const t = Math.min(w / 0.4, 1.0);
	const bg = lerp('#fde8f5', '#E236A2', t);
	return [bg, t > 0.55 ? '#ffffff' : '#000000'];
}

// Bait affinity: discrete buckets matching baitColor() in the Apps Script.
export function baitColor(value) {
	if (value >= 1.0) return ['#4caf50', '#ffffff'];
	if (value >= 0.5) return ['#8bc34a', '#000000'];
	if (value >= 0.2) return ['#fff9c4', '#000000'];
	return ['#ffcdd2', '#999999'];
}
