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
		color: string;
		key: number;
	}

	// Map hljs classes to colors (github-dark inspired)
	const hljsColors: Record<string, string> = {
		'hljs-keyword': '#ff7b72',
		'hljs-built_in': '#79c0ff',
		'hljs-type': '#79c0ff',
		'hljs-literal': '#79c0ff',
		'hljs-number': '#79c0ff',
		'hljs-operator': '#ff7b72',
		'hljs-punctuation': '#c9d1d9',
		'hljs-property': '#79c0ff',
		'hljs-regexp': '#7ee787',
		'hljs-string': '#a5d6ff',
		'hljs-char.escape': '#a5d6ff',
		'hljs-subst': '#c9d1d9',
		'hljs-symbol': '#ffa657',
		'hljs-variable': '#ffa657',
		'hljs-selector-class': '#ffa657',
		'hljs-selector-tag': '#7ee787',
		'hljs-selector-id': '#ffa657',
		'hljs-selector-attr': '#79c0ff',
		'hljs-class': '#ffa657',
		'hljs-title': '#d2a8ff',
		'hljs-title.class_': '#f0883e',
		'hljs-title.class_.inherited__': '#f0883e',
		'hljs-title.function_': '#d2a8ff',
		'hljs-function': '#d2a8ff',
		'hljs-params': '#c9d1d9',
		'hljs-comment': '#8b949e',
		'hljs-doctag': '#ff7b72',
		'hljs-meta': '#8b949e',
		'hljs-section': '#1f6feb',
		'hljs-tag': '#7ee787',
		'hljs-name': '#7ee787',
		'hljs-attr': '#79c0ff',
		'hljs-attribute': '#79c0ff',
		'hljs-addition': '#aff5b4',
		'hljs-deletion': '#ffdcd7',
		'hljs-link': '#a5d6ff'
	};

	function resolveColor(className: string): string {
		if (!className) return '';
		// Try exact match first, then first class
		return hljsColors[className] || hljsColors[className.split(' ')[0]] || '';
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
			const decoded = text
				.replace(/&amp;/g, '&')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&quot;/g, '"')
				.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
				.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
			// Split by spaces and newlines, preserving both
			const parts = decoded.split(/( +|\n)/);
			const color = resolveColor(className);
			for (const part of parts) {
				if (part.length > 0) {
					words.push({ word: part, className, color, key: keyCounter++ });
				}
			}
		}

		return words;
	});

</script>

<pre><code
	>{#each highlightedWords as { word, color, key } (key)}{#if word === '\n'}
{:else}<span
			style="animation-name: {animation}; animation-duration: {animationDuration}; animation-timing-function: {animationTimingFunction}; animation-iteration-count: 1; white-space: pre-wrap; display: inline-block;{color ? ` color: ${color};` : ''}"
		>{word}</span>{/if}{/each}</code
></pre>
