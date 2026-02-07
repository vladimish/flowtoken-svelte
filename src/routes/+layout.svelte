<script lang="ts">
	import '../app.css';
	import '$lib/styles.css';
	import 'highlight.js/styles/github.css';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/text', label: 'Text Animations' },
		{ href: '/markdown', label: 'Markdown' },
		{ href: '/interactive', label: 'Interactive' }
	];
</script>

<div class="flex min-h-screen">
	<nav class="w-56 shrink-0 border-r border-gray-200 bg-gray-50 p-4">
		<h2 class="mb-4 text-xl font-bold">FlowToken</h2>
		<p class="mb-4 text-xs text-gray-500">Svelte 5 Port</p>
		<ul class="space-y-2">
			{#each navItems as { href, label }}
				<li>
					<a
						{href}
						class="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
					>
						{label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	<main class="flex-1 p-8">
		{@render children()}
	</main>
</div>
