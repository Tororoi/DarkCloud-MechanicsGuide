<script>
	let { icon, title, desc } = $props();
</script>

<svelte:head>
	<title>{title} — Dark Cloud Mechanics Guide</title>
</svelte:head>

<div class="page">
	<div class="page-intro">
		<h1>{icon} {title}</h1>
		<p>{desc}</p>
	</div>

	<div class="card">
		<div class="card-body">
			<div class="coming-soon">
				<div class="big">{icon}</div>
				<div>This section is planned. Data and tools will go here.</div>
			</div>
		</div>
	</div>
</div>

<style>
	.coming-soon {
		text-align: center;
		color: #78909c;
		padding: 48px 16px;
	}
	.coming-soon .big {
		font-size: 42px;
		margin-bottom: 8px;
	}
</style>
