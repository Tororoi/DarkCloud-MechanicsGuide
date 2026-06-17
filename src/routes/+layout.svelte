<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Nav />

{@render children()}

<footer class="site-footer">
	Dark Cloud Mechanics Guide · vanilla &amp; romhack reference · tools run entirely in your browser.
</footer>
