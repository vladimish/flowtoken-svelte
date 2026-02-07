<script lang="ts">
	interface TokenWithSource {
		text: string;
		source: number;
	}

	let {
		input,
		sep,
		animation,
		animationDuration,
		animationTimingFunction,
		animationIterationCount = 1
	}: {
		input: string;
		sep: string;
		animation: string;
		animationDuration: string;
		animationTimingFunction: string;
		animationIterationCount?: number;
	} = $props();

	// Animations using transform/width need inline-block; others work with inline
	const transformAnimations = new Set([
		'ft-slideUp', 'ft-wave', 'ft-elastic', 'ft-bounceIn',
		'ft-rotateIn', 'ft-fadeAndScale', 'ft-slideInFromLeft',
		'ft-typewriter', 'ft-dropIn'
	]);
	const display = $derived(transformAnimations.has(animation) ? 'inline-block' : 'inline');

	// Mutable state for diff mode — persists across renders
	let prevInput = '';
	let tokensWithSources: TokenWithSource[] = [];
	let fullText = '';

	let tokens = $derived.by(() => {
		if (typeof input !== 'string') return [];

		if (sep === 'diff') {
			// If this is the first render or we've gone backward, reset everything
			if (!prevInput || input.length < prevInput.length) {
				tokensWithSources = [];
				fullText = '';
			}

			// Only process input if it's different from previous
			if (input !== prevInput) {
				if (input.includes(fullText)) {
					const uniqueNewContent = input.slice(fullText.length);
					if (uniqueNewContent.length > 0) {
						tokensWithSources = [
							...tokensWithSources,
							{
								text: uniqueNewContent,
								source: tokensWithSources.length
							}
						];
						fullText = input;
					}
				} else {
					tokensWithSources = [{ text: input, source: 0 }];
					fullText = input;
				}
			}

			prevInput = input;
			return tokensWithSources;
		}

		// Word/char splitting
		let splitRegex: RegExp;
		if (sep === 'word') {
			splitRegex = /(\s+)/;
		} else if (sep === 'char') {
			splitRegex = /(.)/;
		} else {
			throw new Error('Invalid separator: must be "word", "char", or "diff"');
		}

		prevInput = input;
		return input
			.split(splitRegex)
			.filter((t) => t.length > 0)
			.map((text, i) => ({ text, source: i }));
	});

</script>

{#each tokens as token (token.source)}
	<span
		style="animation-name: {animation}; animation-duration: {animationDuration}; animation-timing-function: {animationTimingFunction}; animation-iteration-count: {animationIterationCount}; white-space: pre-wrap; display: {display};"
	>{token.text}</span>
{/each}
