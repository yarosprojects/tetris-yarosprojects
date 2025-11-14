<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import '../app.css';

	let { children } = $props();
	injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Tetris Game</title>
</svelte:head>

{@render children()}
