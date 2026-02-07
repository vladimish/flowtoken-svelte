<script lang="ts">
	import AnimatedMarkdown from '$lib/components/AnimatedMarkdown.svelte';
	import { text as testMarkdown } from '$lib/TestMarkdown.js';
	import { animations } from '$lib/utils/animations.js';
	import { onMount } from 'svelte';

	let controls = $state({
		animation: 'fadeIn',
		sep: 'word',
		animationDuration: 0.6,
		animationTimingFunction: 'ease-in-out',
		generationSpeed: 3
	});

	let currentText = $state('');
	let remainingTokens = $state<string[]>([]);
	let tokenCount = $state(0);
	let mounted = $state(false);
	let runId = $state(0);

	// Reset streaming when controls change
	function resetStream() {
		runId++;
		currentText = '';
		tokenCount = 0;
		remainingTokens = testMarkdown.split(' ');
	}

	onMount(() => {
		mounted = true;
		remainingTokens = testMarkdown.split(' ');
	});

	// Stream tokens
	$effect(() => {
		if (!mounted || remainingTokens.length === 0) {
			// If we've finished, restart after a delay
			if (mounted && remainingTokens.length === 0 && currentText.length > 0) {
				const currentRunId = runId;
				const timeout = setTimeout(() => {
					if (runId === currentRunId) {
						resetStream();
					}
				}, 2000);
				return () => clearTimeout(timeout);
			}
			return;
		}

		const baseLatency = 1000 / controls.generationSpeed;
		const jitter = Math.random() * 5;
		const delay = baseLatency + jitter;

		// Simulate occasional network jitter every 5 tokens
		let extra = 0;
		if (tokenCount > 0 && tokenCount % 5 === 0) {
			extra = Math.random() > 0.5 ? 400 : 0;
		}

		const currentRunId = runId;
		const timeout = setTimeout(() => {
			if (runId !== currentRunId) return;
			const nextToken = remainingTokens[0];
			currentText = currentText ? `${currentText} ${nextToken}` : nextToken;
			remainingTokens = remainingTokens.slice(1);
			tokenCount++;
		}, delay + extra);

		return () => clearTimeout(timeout);
	});

	const animationDurationString = $derived(`${controls.animationDuration}s`);
	const animationNames = Object.keys(animations);
</script>

<div class="flex flex-col gap-8 md:flex-row">
	<!-- Controls panel -->
	<div class="w-full max-w-xs shrink-0">
		<h1 class="mb-2 text-3xl font-bold">FlowToken</h1>
		<p class="mb-4 text-sm text-gray-500">Interactive demo with configurable controls.</p>

		<div class="space-y-4">
			<label class="block">
				<span class="text-sm font-medium text-gray-700">Animation</span>
				<select
					bind:value={controls.animation}
					onchange={resetStream}
					class="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
				>
					<option value="none">None</option>
					{#each animationNames as name}
						<option value={name}>{name}</option>
					{/each}
				</select>
			</label>

			<label class="block">
				<span class="text-sm font-medium text-gray-700">Separator</span>
				<select
					bind:value={controls.sep}
					onchange={resetStream}
					class="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
				>
					<option value="word">Word</option>
					<option value="char">Character</option>
				</select>
			</label>

			<label class="block">
				<span class="text-sm font-medium text-gray-700">Animation Duration (s)</span>
				<input
					type="number"
					step="0.1"
					min="0.1"
					bind:value={controls.animationDuration}
					onchange={resetStream}
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
				/>
			</label>

			<label class="block">
				<span class="text-sm font-medium text-gray-700">Timing Function</span>
				<select
					bind:value={controls.animationTimingFunction}
					onchange={resetStream}
					class="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
				>
					<option value="ease-in-out">Ease In Out</option>
					<option value="ease-in">Ease In</option>
					<option value="ease-out">Ease Out</option>
					<option value="linear">Linear</option>
				</select>
			</label>

			<label class="block">
				<span class="text-sm font-medium text-gray-700">Generation Speed (tokens/s)</span>
				<input
					type="number"
					step="0.5"
					min="0.5"
					bind:value={controls.generationSpeed}
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
				/>
			</label>

			<button
				onclick={resetStream}
				class="w-full rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
			>
				Restart
			</button>
		</div>
	</div>

	<!-- Markdown output -->
	<div class="prose lg:prose-md prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent min-w-0 flex-1">
		{#if mounted && currentText.length > 0}
			<AnimatedMarkdown
				content={currentText}
				animation={controls.animation === 'none' ? '' : controls.animation}
				sep={controls.sep}
				animationDuration={animationDurationString}
				animationTimingFunction={controls.animationTimingFunction}
			/>
		{/if}
	</div>
</div>
