<script>
	import '$lib/global.css';

    import Topbar from '$lib/components/layout/Topbar.svelte';
	
	const { data, children } = $props();
	const { user } = data;
</script>

<main class="bg-base-200 overflow-auto flex flex-col min-h-screen">
	<Topbar {user}/>
	{@render children()}
</main>
