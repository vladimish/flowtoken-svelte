<script lang="ts">
	import CodeRenderer from './CodeRenderer.svelte';
	import SplitText from './SplitText.svelte';

	let {
		text = '',
		lang = '',
		animation = '',
		animationDuration = '1s',
		animationTimingFunction = 'ease-in-out'
	}: {
		text?: string;
		lang?: string;
		animation?: string;
		animationDuration?: string;
		animationTimingFunction?: string;
	} = $props();

	let copied = $state(false);

	function handleCopy() {
		if (typeof window === 'undefined') return;
		navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	const isBlock = $derived(!!lang);
</script>

{#if isBlock}
	<div class="relative" style="animation-name: {animation}; animation-duration: {animationDuration}; animation-timing-function: {animationTimingFunction}; animation-iteration-count: 1;">
		<button
			onclick={handleCopy}
			style="background-color: rgba(0,0,0,0.2); position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10; opacity: 0.7; cursor: pointer; border-radius: 0.5rem; padding: 0.25rem; color: white;"
			aria-label={copied ? 'Copied!' : 'Copy code'}
		>
			{#if copied}
				<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M20 6L9 17l-5-5" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
				</svg>
			{/if}
		</button>
		<CodeRenderer
			code={text}
			language={lang}
			{animation}
			{animationDuration}
			{animationTimingFunction}
		/>
	</div>
{:else}
	<code>
		<SplitText
			input={text}
			sep="word"
			{animation}
			{animationDuration}
			{animationTimingFunction}
		/>
	</code>
{/if}
