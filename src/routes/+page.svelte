<script lang="ts">
	import { animations } from '$lib/utils/animations.js';
</script>

<div class="max-w-2xl">
	<h1 class="mb-4 text-4xl font-bold">FlowToken for Svelte</h1>
	<p class="mb-6 text-gray-600">
		Animate streaming LLM text with CSS animations. A Svelte 5 port of the FlowToken React library.
	</p>

	<div class="mb-8 rounded-lg bg-gray-50 p-6">
		<h2 class="mb-3 text-lg font-semibold">Available Animations</h2>
		<div class="flex flex-wrap gap-2">
			{#each Object.keys(animations) as name}
				<span class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">{name}</span>
			{/each}
		</div>
	</div>

	<div class="space-y-4">
		<h2 class="text-lg font-semibold">Demos</h2>
		<ul class="list-inside list-disc space-y-2 text-gray-700">
			<li><a href="/text" class="text-blue-600 hover:underline">Text Animations</a> — All 14 animations with streaming Shakespeare text</li>
			<li><a href="/markdown" class="text-blue-600 hover:underline">Markdown</a> — Full markdown rendering with animated tokens</li>
			<li><a href="/interactive" class="text-blue-600 hover:underline">Interactive</a> — Controls for animation, separator, speed, and more</li>
		</ul>
	</div>
</div>
