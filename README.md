# @vladimish/flowtoken-svelte

Svelte 5 port of [FlowToken](https://github.com/Ephibbs/flowtoken) — animate streaming LLM text with CSS animations.

## Install

```bash
npm install @vladimish/flowtoken-svelte
```

## Quick Start

```svelte
<script>
  import { AnimatedMarkdown } from '@vladimish/flowtoken-svelte';
  import '@vladimish/flowtoken-svelte/styles.css';

  let text = $state('');

  // Append tokens as they stream in
  // text += newToken;
</script>

<AnimatedMarkdown content={text} animation="fadeIn" />
```

## Components

### AnimatedMarkdown

Main component. Renders markdown with per-token animations.

```svelte
<AnimatedMarkdown
  content={text}
  animation="fadeIn"
  sep="word"
  animationDuration="0.6s"
  animationTimingFunction="ease-in-out"
/>
```

| Prop | Default | Description |
|------|---------|-------------|
| `content` | required | Markdown string to render |
| `animation` | `"fadeIn"` | Animation name (see list below) |
| `sep` | `"diff"` | Token split mode: `"word"`, `"char"`, or `"diff"` |
| `animationDuration` | `"1s"` | CSS animation duration |
| `animationTimingFunction` | `"ease-in-out"` | CSS timing function |
| `imgHeight` | `"20rem"` | Default image height |

### AnimatedText

Streaming text with staggered token animations. Useful outside of markdown contexts.

```svelte
<AnimatedText incomingText={text} animation="blurIn" sep="token" />
```

### SplitText

Low-level tokenizer. Splits text by word, character, or diff and animates each token.

```svelte
<SplitText input={text} sep="word" animation="fadeIn" animationDuration="0.5s" animationTimingFunction="ease-in-out" />
```

### AnimatedImage

Image that animates on load.

```svelte
<AnimatedImage src="..." alt="..." animation="fadeIn" animationDuration="1s" animationTimingFunction="ease-in-out" />
```

### DefaultCode / CodeRenderer

Code blocks with syntax highlighting (highlight.js) and per-word animation. Used internally by `AnimatedMarkdown` but can be used standalone.

```svelte
<DefaultCode text={code} lang="python" animation="fadeIn" animationDuration="0.6s" animationTimingFunction="ease-in-out" />
```

## Animations

14 built-in animations:

| Name | Effect |
|------|--------|
| `fadeIn` | Opacity 0 to 1 |
| `blurIn` | Blur + fade in |
| `dropIn` | Drop from above |
| `slideUp` | Slide up + fade |
| `slideInFromLeft` | Slide from left |
| `fadeAndScale` | Scale up + fade |
| `bounceIn` | Bounce effect |
| `elastic` | Elastic scale |
| `rotateIn` | Rotate in |
| `wave` | Wave up and down |
| `colorTransition` | Red to black |
| `highlight` | Yellow highlight fade |
| `blurAndSharpen` | Blur to sharp |
| `typewriter` | Width expand |

## Token Modes

- **`"diff"`** (default for AnimatedMarkdown) — Only new tokens animate. Already-rendered tokens stay static. Best for streaming.
- **`"word"`** — Split by whitespace. Every token animates on each render.
- **`"char"`** — Split by character.

## Demo

```bash
git clone https://github.com/vladimish/flowtoken-svelte
cd flowtoken-svelte
npm install
npm run dev
```

Routes:
- `/` — Landing page
- `/text` — All 14 animations side by side
- `/markdown` — Full markdown with controls
- `/interactive` — Configurable streaming demo

## License

ISC
