<script lang="ts">
	import { setContext } from 'svelte';
	import type { Component, Snippet } from 'svelte';
	import { Lexer, type Token, type Tokens } from 'marked';
	import SplitText from './SplitText.svelte';
	import AnimatedImage from './AnimatedImage.svelte';
	import DefaultCode from './DefaultCode.svelte';
	import CodeRenderer from './CodeRenderer.svelte';
	import { animations } from '../utils/animations.js';

	let {
		content,
		sep = 'diff',
		animation: animationName = 'fadeIn',
		animationDuration = '1s',
		animationTimingFunction = 'ease-in-out',
		customComponents = {},
		imgHeight = '20rem',
		codeBlockComponent = undefined
	}: {
		content: string;
		sep?: string;
		animation?: string;
		animationDuration?: string;
		animationTimingFunction?: string;
		customComponents?: Record<string, any>;
		imgHeight?: string;
		codeBlockComponent?: Component<{ code: string; language: string; children?: Snippet }>;
	} = $props();

	const resolvedAnimation = $derived(
		animations[animationName as keyof typeof animations] || animationName
	);

	const animStyle = $derived(
		`animation-name: ${resolvedAnimation}; animation-duration: ${animationDuration}; animation-timing-function: ${animationTimingFunction}; animation-iteration-count: 1; white-space: pre-wrap;`
	);

	// Sanitize HTML to prevent XSS
	const ALLOWED_TAGS = new Set([
		'br', 'hr', 'div', 'span', 'p', 'b', 'i', 'u', 's', 'em', 'strong',
		'sub', 'sup', 'mark', 'small', 'del', 'ins', 'abbr', 'details', 'summary',
		'ul', 'ol', 'li', 'dl', 'dt', 'dd',
		'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
		'blockquote', 'pre', 'code', 'kbd', 'var', 'samp',
		'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
		'a', 'img', 'figure', 'figcaption', 'picture', 'source',
		'section', 'article', 'aside', 'header', 'footer', 'nav', 'main',
		'ruby', 'rt', 'rp', 'wbr', 'time', 'cite', 'dfn', 'q'
	]);

	function sanitizeHtml(html: string): string {
		// Strip event handler attributes (on*)
		let sanitized = html.replace(/<([a-zA-Z][a-zA-Z0-9]*)\s([^>]*?)>/g, (match, tag, attrs) => {
			const cleanAttrs = attrs.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');
			return `<${tag} ${cleanAttrs}>`;
		});
		// Strip script, style, iframe, object, embed, form, input, textarea, select, button tags
		sanitized = sanitized.replace(/<\/?(?:script|style|iframe|object|embed|form|input|textarea|select|button|link|meta|base)\b[^>]*>/gi, '');
		// Strip javascript: and data: URLs in href/src/action attributes
		sanitized = sanitized.replace(/(?:href|src|action)\s*=\s*(?:"[^"]*(?:javascript|data|vbscript):[^"]*"|'[^']*(?:javascript|data|vbscript):[^']*')/gi, '');
		return sanitized;
	}

	// Hide partial custom component tags during streaming
	function hidePartialCustomComponents(input: string): string {
		if (!input || Object.keys(customComponents).length === 0) return input;

		const lastOpeningBracketIndex = input.lastIndexOf('<');
		if (lastOpeningBracketIndex !== -1) {
			const textAfterLastOpeningBracket = input.substring(lastOpeningBracketIndex);
			if (!textAfterLastOpeningBracket.includes('>')) {
				for (const tag of Object.keys(customComponents)) {
					if (
						textAfterLastOpeningBracket
							.substring(1)
							.startsWith(tag.substring(0, textAfterLastOpeningBracket.length - 1)) ||
						new RegExp(`^<${tag}(\\s|$)`).test(textAfterLastOpeningBracket)
					) {
						return input.substring(0, lastOpeningBracketIndex);
					}
				}
			}
		}

		return input;
	}

	// Parse markdown into tokens
	const tokens = $derived.by(() => {
		const processed = hidePartialCustomComponents(content);
		const lexer = new Lexer({ gfm: true });
		return lexer.lex(processed);
	});
</script>

{#snippet renderInline(tokens: Token[])}
	{#each tokens as token}
		{#if token.type === 'text'}
			<SplitText
				input={token.raw}
				{sep}
				animation={resolvedAnimation}
				{animationDuration}
				{animationTimingFunction}
			/>
		{:else if token.type === 'strong'}
			<strong>
				{#if token.tokens}
					{@render renderInline(token.tokens)}
				{:else}
					<SplitText input={token.text} {sep} animation={resolvedAnimation} {animationDuration} {animationTimingFunction} />
				{/if}
			</strong>
		{:else if token.type === 'em'}
			<em>
				{#if token.tokens}
					{@render renderInline(token.tokens)}
				{:else}
					<SplitText input={token.text} {sep} animation={resolvedAnimation} {animationDuration} {animationTimingFunction} />
				{/if}
			</em>
		{:else if token.type === 'codespan'}
			<DefaultCode
				text={token.text}
				animation={resolvedAnimation}
				{animationDuration}
				{animationTimingFunction}
			/>
		{:else if token.type === 'link'}
			<a href={token.href} target="_blank" rel="noopener noreferrer">
				{#if token.tokens}
					{@render renderInline(token.tokens)}
				{:else}
					<SplitText input={token.text} {sep} animation={resolvedAnimation} {animationDuration} {animationTimingFunction} />
				{/if}
			</a>
		{:else if token.type === 'image'}
			<AnimatedImage
				src={token.href}
				alt={token.text}
				animation={resolvedAnimation}
				{animationDuration}
				{animationTimingFunction}
				height={imgHeight}
			/>
		{:else if token.type === 'del'}
			<del>
				{#if token.tokens}
					{@render renderInline(token.tokens)}
				{:else}
					<SplitText input={token.text} {sep} animation={resolvedAnimation} {animationDuration} {animationTimingFunction} />
				{/if}
			</del>
		{:else if token.type === 'html'}
			{@html sanitizeHtml(token.raw)}
		{:else if token.type === 'br'}
			<br />
		{:else if token.type === 'escape'}
			<SplitText input={token.text} {sep} animation={resolvedAnimation} {animationDuration} {animationTimingFunction} />
		{:else}
			<SplitText input={token.raw} {sep} animation={resolvedAnimation} {animationDuration} {animationTimingFunction} />
		{/if}
	{/each}
{/snippet}

{#snippet renderTokens(tokenList: Token[])}
	{#each tokenList as token}
		{#if token.type === 'heading'}
			{#if token.depth === 1}
				<h1 style={animStyle}>
					{#if token.tokens}
						{@render renderInline(token.tokens)}
					{/if}
				</h1>
			{:else if token.depth === 2}
				<h2 style={animStyle}>
					{#if token.tokens}
						{@render renderInline(token.tokens)}
					{/if}
				</h2>
			{:else if token.depth === 3}
				<h3 style={animStyle}>
					{#if token.tokens}
						{@render renderInline(token.tokens)}
					{/if}
				</h3>
			{:else if token.depth === 4}
				<h4 style={animStyle}>
					{#if token.tokens}
						{@render renderInline(token.tokens)}
					{/if}
				</h4>
			{:else if token.depth === 5}
				<h5 style={animStyle}>
					{#if token.tokens}
						{@render renderInline(token.tokens)}
					{/if}
				</h5>
			{:else}
				<h6 style={animStyle}>
					{#if token.tokens}
						{@render renderInline(token.tokens)}
					{/if}
				</h6>
			{/if}
		{:else if token.type === 'paragraph'}
			<p>
				{#if token.tokens}
					{@render renderInline(token.tokens)}
				{/if}
			</p>
		{:else if token.type === 'blockquote'}
			<blockquote style={animStyle}>
				{#if token.tokens}
					{@render renderTokens(token.tokens)}
				{/if}
			</blockquote>
		{:else if token.type === 'list'}
			{#if token.ordered}
				<ol start={token.start || 1}>
					{#each token.items as item}
						<li class="custom-li" style={animStyle}>
							{#if item.tokens}
								{@render renderTokens(item.tokens)}
							{/if}
						</li>
					{/each}
				</ol>
			{:else}
				<ul>
					{#each token.items as item}
						<li class="custom-li" style={animStyle}>
							{#if item.tokens}
								{@render renderTokens(item.tokens)}
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		{:else if token.type === 'code'}
			{#if codeBlockComponent}
				<svelte:component this={codeBlockComponent} code={token.text} language={token.lang || ''}>
					<CodeRenderer
						code={token.text}
						language={token.lang || ''}
						animation={resolvedAnimation}
						{animationDuration}
						{animationTimingFunction}
					/>
				</svelte:component>
			{:else}
				<DefaultCode
					text={token.text}
					lang={token.lang || ''}
					animation={resolvedAnimation}
					{animationDuration}
					{animationTimingFunction}
				/>
			{/if}
		{:else if token.type === 'hr'}
			<hr style={animStyle} />
		{:else if token.type === 'table'}
			<table style={animStyle}>
				<thead>
					<tr>
						{#each token.header as cell}
							<th>
								{#if cell.tokens}
									{@render renderInline(cell.tokens)}
								{/if}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each token.rows as row}
						<tr>
							{#each row as cell}
								<td>
									{#if cell.tokens}
										{@render renderInline(cell.tokens)}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		{:else if token.type === 'html'}
			{@html sanitizeHtml(token.raw)}
		{:else if token.type === 'text'}
			{#if 'tokens' in token && token.tokens}
				{@render renderInline(token.tokens)}
			{:else}
				<SplitText input={token.raw} {sep} animation={resolvedAnimation} {animationDuration} {animationTimingFunction} />
			{/if}
		{:else if token.type === 'space'}
			<!-- whitespace -->
		{/if}
	{/each}
{/snippet}

<div>
	{@render renderTokens(tokens)}
</div>
