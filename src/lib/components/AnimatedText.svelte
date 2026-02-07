<script lang="ts">
	const isBrowser = typeof window !== 'undefined';

	let {
		incomingText,
		animation = '',
		sep = 'token'
	}: {
		incomingText: string;
		animation?: string;
		sep?: string;
	} = $props();

	let animatingTokens = $state<{ token: string; id: number }[]>([]);
	let completedTokens = $state<string[]>([]);

	let lastTokenTime: number | null = isBrowser ? performance.now() : 0;
	let numId = 0;
	let receivedText = '';

	const animationDuration = '0.5s';
	const animationTimingFunction = 'ease-in-out';

	$effect(() => {
		if (incomingText) {
			const textToSplit = incomingText.slice(receivedText.length);

			let newTokens: string[] = [];
			if (sep === 'token') {
				newTokens = textToSplit.split(/(\s+)/).filter((t) => t.length > 0);
			} else if (sep === 'char') {
				newTokens = textToSplit.split('');
			} else {
				throw new Error('Invalid separator');
			}

			const newTokenObjects = newTokens.map((token) => ({ token, id: numId++ }));
			if (newTokenObjects.length === 0) return;

			newTokenObjects.forEach((tokenObj) => {
				const now = isBrowser ? performance.now() : 0;
				const delay = Math.max(0, 10 - (now - (lastTokenTime || 0)));
				lastTokenTime = Math.max(now + delay, lastTokenTime || 0);
				setTimeout(() => {
					animatingTokens = [...animatingTokens, tokenObj];
				}, delay);
			});

			receivedText = incomingText;
		}
	});
</script>

<div>
	<span>{completedTokens.join('')}</span>
	{#each animatingTokens as { token, id } (id)}
		{#if token === '\n'}
			<br />
		{:else}
			<span
				style="animation-name: {animation}; animation-duration: {animationDuration}; animation-timing-function: {animationTimingFunction}; animation-iteration-count: 1; white-space: pre; display: inline-block;"
			>{token}</span>
		{/if}
	{/each}
</div>
