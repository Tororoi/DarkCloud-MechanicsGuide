<script>
	import { page } from '$app/state';
	import { base } from '$app/paths';

	const sections = [
		{ href: '/', label: 'Home' },
		{ href: '/fishing', label: '🎣 Fishing' },
		{ href: '/weapons', label: '⚔️ Weapons' },
		{ href: '/enemies', label: '👹 Enemies' },
		{ href: '/dungeons', label: '🏰 Dungeons' }
	];

	function isActive(href) {
		const path = page.url.pathname.replace(base, '') || '/';
		if (href === '/') return path === '/';
		return path === href || path.startsWith(href + '/');
	}
</script>

<header class="site-header">
	<a class="brand" href="{base}/">
		<span class="brand-title">Dark Cloud Mechanics Guide</span>
		<span class="brand-sub">vanilla &amp; romhack reference</span>
	</a>
	<nav class="site-nav">
		{#each sections as s (s.href)}
			<a href="{base}{s.href}" class:active={isActive(s.href)}>{s.label}</a>
		{/each}
	</nav>
</header>

<style>
	.site-header {
		background: var(--navy);
		color: #fff;
		padding: 12px 24px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}
	.brand {
		color: #fff;
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}
	.brand:hover {
		text-decoration: none;
	}
	.brand-title {
		font-size: 18px;
		font-weight: bold;
	}
	.brand-sub {
		font-size: 11px;
		color: #aac4e8;
		margin-top: 2px;
	}
	.site-nav {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
	}
	.site-nav a {
		color: #dce7f5;
		padding: 6px 12px;
		border-radius: 4px;
		font-size: 13px;
		font-weight: bold;
	}
	.site-nav a:hover {
		background: rgba(255, 255, 255, 0.12);
		text-decoration: none;
		color: #fff;
	}
	.site-nav a.active {
		background: var(--blue);
		color: #fff;
	}
</style>
