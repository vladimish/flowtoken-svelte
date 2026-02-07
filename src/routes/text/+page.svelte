<script lang="ts">
	import AnimatedText from '$lib/components/AnimatedText.svelte';
	import { animations } from '$lib/utils/animations.js';
	import { onMount } from 'svelte';

	const shakespeareText = `To be, or not to be, that is the question:
Whether 'tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles
And by opposing end them. To die—to sleep,
No more; and by a sleep to say we end
The heart-ache and the thousand natural shocks
That flesh is heir to: 'tis a consummation
Devoutly to be wish'd. To die, to sleep;
To sleep, perchance to dream—ay, there's the rub:
For in that sleep of death what dreams may come,
When we have shuffled off this mortal coil,
Must give us pause—there's the respect
That makes calamity of so long life.`;

	const animationNames = Object.keys(animations);

	// Each demo gets its own streaming state
	let demoTexts = $state<string[]>(animationNames.map(() => ''));
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const words = shakespeareText.split(' ');

		animationNames.forEach((_, demoIndex) => {
			let wordIndex = 0;
			const baseLatency = 80 + Math.random() * 40;

			function sendNextWord() {
				if (wordIndex < words.length) {
					const nextWord = words[wordIndex];
					demoTexts[demoIndex] = demoTexts[demoIndex]
						? `${demoTexts[demoIndex]} ${nextWord}`
						: nextWord;
					wordIndex++;
					const jitter = Math.random() * 20;
					setTimeout(sendNextWord, baseLatency + jitter);
				}
			}

			// Stagger start times so demos don't all start at once
			setTimeout(sendNextWord, demoIndex * 200);
		});
	});
</script>

<div>
	<h1 class="mb-6 text-3xl font-bold">Text Animations</h1>
	<p class="mb-8 text-gray-600">All 14 animations streaming Shakespeare's Hamlet soliloquy.</p>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
		{#each animationNames as name, i}
			<div class="rounded-lg border border-gray-200 p-4">
				<h3 class="mb-2 text-sm font-semibold text-gray-500">{name}</h3>
				<div class="min-h-32 text-sm">
					{#if mounted}
						<AnimatedText
							incomingText={demoTexts[i]}
							animation={animations[name]}
						/>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
