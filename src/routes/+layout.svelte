<script>
    import Header from '$lib/components/layout/Header.svelte'
	import '$lib/global.css';
	const { children } = $props();
</script>

<main class="bg-base-200 overflow-auto flex flex-col min-h-screen">
	<Header />
	{@render children()}
</main>
