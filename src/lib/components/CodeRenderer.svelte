<script lang="ts">
	import hljs from 'highlight.js';

	let {
		code,
		language = '',
		animation = '',
		animationDuration = '1s',
		animationTimingFunction = 'ease-in-out'
	}: {
		code: string;
		language?: string;
		animation?: string;
		animationDuration?: string;
		animationTimingFunction?: string;
	} = $props();

	interface HighlightedWord {
		word: string;
		className: string;
		key: number;
	}

	let keyCounter = 0;

	let highlightedWords = $derived.by((): HighlightedWord[] => {
		keyCounter = 0;
		let highlighted: string;
		try {
			if (language && hljs.getLanguage(language)) {
				highlighted = hljs.highlight(code, { language }).value;
			} else {
				highlighted = hljs.highlightAuto(code).value;
			}
		} catch {
			highlighted = code
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
		}

		// Parse the highlighted HTML into words with their classes
		const words: HighlightedWord[] = [];
		// Match either <span class="...">text</span> or plain text segments
		const regex = /(<span class="([^"]*)">(.*?)<\/span>)|([^<]+)/g;
		let match: RegExpExecArray | null;

		while ((match = regex.exec(highlighted)) !== null) {
			const className = match[2] || '';
			const text = match[3] || match[4] || '';
			// Decode HTML entities
			const decoded = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
			// Split by spaces, preserving spaces
			const parts = decoded.split(/( +)/);
			for (const part of parts) {
				if (part.length > 0) {
					words.push({ word: part, className, key: keyCounter++ });
				}
			}
		}

		return words;
	});

</script>

<pre class="hljs"><code
	>{#each highlightedWords as { word, className, key } (key)}<span
			class={className}
			style="animation-name: {animation}; animation-duration: {animationDuration}; animation-timing-function: {animationTimingFunction}; animation-iteration-count: 1; white-space: pre-wrap; display: inline-block;"
		>{word}</span>{/each}</code
></pre>
