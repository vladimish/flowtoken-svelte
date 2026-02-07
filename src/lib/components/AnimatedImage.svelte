<script lang="ts">
	let {
		src,
		alt,
		animation,
		animationDuration,
		animationTimingFunction,
		animationIterationCount = 1,
		height = 'auto',
		width = 'auto',
		objectFit = 'contain'
	}: {
		src: string;
		alt: string;
		animation: string;
		animationDuration: string;
		animationTimingFunction: string;
		animationIterationCount?: number;
		height?: string;
		width?: string;
		objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
	} = $props();

	let isLoaded = $state(false);

	const baseStyle = $derived(
		`height: ${height}; width: ${width}; object-fit: ${objectFit}; max-width: 100%;`
	);

	const imageStyle = $derived(
		isLoaded
			? `${baseStyle} animation-name: ${animation}; animation-duration: ${animationDuration}; animation-timing-function: ${animationTimingFunction}; animation-iteration-count: ${animationIterationCount}; white-space: pre-wrap;`
			: `${baseStyle} opacity: 0; background-color: #f0f0f0;`
	);
</script>

<img
	{src}
	{alt}
	onload={() => (isLoaded = true)}
	style={imageStyle}
/>
