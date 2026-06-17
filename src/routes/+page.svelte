<script>
	import { base } from '$app/paths';

	const sections = [
		{ href: '/fishing', icon: '🎣', title: 'Fishing', desc: 'Species stats, spawn weights, bait affinities, and a size-distribution + FP simulator.', status: 'Available', ready: true },
		{ href: '/weapons', icon: '⚔️', title: 'Weapons', desc: 'Weapon stats, build-ups, attachments, and synthesis mechanics.', status: 'Planned', ready: false },
		{ href: '/enemies', icon: '👹', title: 'Enemies', desc: 'Enemy stats, drops, resistances, and spawn behavior.', status: 'Planned', ready: false },
		{ href: '/dungeons', icon: '🏰', title: 'Dungeons', desc: 'Floor layouts, generation rules, conditions, and rewards.', status: 'Planned', ready: false }
	];
</script>

<svelte:head>
	<title>Dark Cloud Mechanics Guide</title>
</svelte:head>

<div class="page">
	<div class="page-intro">
		<h1>Dark Cloud Mechanics Guide</h1>
		<p>
			A companion reference for the Dark Cloud romhack — documenting the underlying game mechanics
			for both the romhack and the vanilla game. Formulas are reverse-engineered from the game's
			code, and the interactive tools run entirely in your browser.
		</p>
	</div>

	<div class="section-grid">
		{#each sections as s (s.href)}
			<a class="section-tile" class:todo={!s.ready} href="{base}{s.href}">
				<h2>{s.icon} {s.title}</h2>
				<p>{s.desc}</p>
				<span class="badge">{s.status}</span>
			</a>
		{/each}
	</div>
</div>

<style>
	.section-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 16px;
	}
	.section-tile {
		display: block;
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
		padding: 20px;
		color: inherit;
		border-top: 4px solid var(--blue);
		transition:
			transform 0.12s,
			box-shadow 0.12s;
	}
	.section-tile:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
		text-decoration: none;
	}
	.section-tile h2 {
		font-size: 18px;
		color: var(--navy);
		margin-bottom: 6px;
	}
	.section-tile p {
		color: #666;
		font-size: 13px;
	}
	.section-tile.todo {
		border-top-color: #b0bec5;
		opacity: 0.85;
	}
	.badge {
		display: inline-block;
		font-size: 10px;
		font-weight: bold;
		background: #eceff1;
		color: #607d8b;
		padding: 2px 8px;
		border-radius: 10px;
		margin-top: 10px;
	}
	.section-tile.todo .badge {
		background: #fff3e0;
		color: #e65100;
	}
</style>
