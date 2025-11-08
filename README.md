# Temporal Lexicon Generator

A generative web artwork exploring chance, temporality, and distributed authorship through computational poetics.

## Overview

The Temporal Lexicon Generator creates living linguistic constellations using timestamp-seeded randomness. Every 5 seconds, a new configuration of words appears—scattered across a dark canvas, fading in as previous words fade out. The experience is never identical twice, yet remains perfectly deterministic: the same timestamp will always produce the same constellation.

This work sits at the intersection of cybernetic art, systems aesthetics, and interactive narrative theory, drawing inspiration from Roy Ascott's "distributed creativity," Billy Klüver's engineered performances, and John Cage's philosophy of chance operations.

## Features

- **Deterministic Randomness**: Uses current timestamp as seed for reproducible yet unpredictable word selection
- **Dual Modes**:
  - **Curated Lexicon**: 50 words from Text & Technology PhD reading lists (cybernetics, memory, embodiment, temporality)
  - **Custom Text**: Input your own text and watch the algorithm select from your vocabulary
- **Visual Aesthetics**: Cybernetics-inspired color palette (cyan, green, amber) on deep black background
- **Dynamic Animations**: Overlapping fade transitions create smooth visual continuity
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Viewing the Work

🌐 **[View Live Demo](#)** *(deploy to GitHub Pages and add link here)*

Or run locally:
1. Clone this repository
2. Open `index.html` in a web browser
3. (Optional) Use a local server: `python -m http.server 8000`

## Conceptual Framework

The work operates within a tension between structure and unpredictability. The system follows strict rules—curated vocabulary, color palette, typographic rhythm—yet the emergent compositions are wholly indeterminate. The algorithm becomes a co-author, revealing what Ascott called "distributed creativity" and what Cage understood as the aesthetic truth that randomness can reveal.

Each constellation exists only in the transient present: appearing, persisting briefly, then dissolving. Meaning arises from ephemeral associations that viewers witness but cannot control, pause, or rewind. The piece asks: what is authorship when time itself becomes the generative parameter?

## Technical Details

- **Technology**: Vanilla HTML/CSS/JavaScript + P5.js
- **Algorithm**: Mulberry32 seeded PRNG for deterministic randomness
- **Update Interval**: 5 seconds
- **Constellation Size**: 5 words simultaneously visible
- **Animation**: 1-second fade in/out with 3-second full visibility
- **No build process**: Pure static site, ready for GitHub Pages

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation.

## Credits

Inspired by:
- **Roy Ascott** - Cybernetic art and telematic distributed creativity
- **Billy Klüver** - Systems aesthetics and art-engineering collaboration
- **Söke Dinkla** - Interactive narrative theory
- **John Cage** - Chance operations and indeterminacy in art

## License

MIT License - feel free to remix, adapt, and build upon this work.
