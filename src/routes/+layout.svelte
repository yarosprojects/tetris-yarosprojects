<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Tetris Game</title>
</svelte:head>

{@render children()}
