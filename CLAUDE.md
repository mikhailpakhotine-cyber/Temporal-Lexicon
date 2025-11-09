# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Temporal-Lexicon is a web-based system that generates words from an input text every few seconds, using the current timestamp as the seed for randomness. This creates a deterministic yet time-varying word generation experience. Words float and drift across the canvas with seeded velocity, and users can generate writing prompts based on currently visible words.

## Technology Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Graphics**: P5.js (via CDN)
- **Deployment**: GitHub Pages (static site)
- **No build process required** - all files are served directly

## File Structure

```
/
├── index.html          # Main page with canvas, controls, artist statement
├── style.css           # Cybernetics aesthetic styling
├── sketch.js           # P5.js visualization logic
├── lexicon.js          # 50-word curated lexicon array
├── CLAUDE.md           # This file
└── README.md           # Project description
```

## Development Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, but recommended for development)

### Running Locally

**Option 1: Direct File Opening**
Simply open `index.html` in a web browser.

**Option 2: Local Web Server (Recommended)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server

# VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then navigate to `http://localhost:8000`

### Deploying to GitHub Pages

1. Push code to your repository
2. Go to repository Settings → Pages
3. Select branch (usually `main`) and root directory (`/`)
4. Save and wait for deployment
5. Site will be available at `https://[username].github.io/Temporal-Lexicon/`

## Architecture Notes

### Core Concept
The application uses `Date.now()` timestamps as seeds for deterministic randomness, creating a living linguistic constellation that:
- Generates **5 words every 5 seconds**
- Displays words with **overlapping fade animations** (new words fade in while old words fade out)
- Positions words **randomly** across the canvas with **varying font sizes** (24-72px)
- Words **drift with flowing motion** - each word has seeded velocity and moves continuously, wrapping around canvas edges
- Uses a **seeded random number generator** (Mulberry32) for reproducibility
- Supports **dual modes**: curated 50-word lexicon or custom user text
- Includes a **writing prompt generator** that creates prompts from currently visible words

### Deterministic Randomness System

**Seeded RNG (sketch.js:17-38)**
- Implements Mulberry32 algorithm for deterministic pseudo-random generation
- Same timestamp always produces same word selection and positioning
- Ensures reproducibility while appearing random to viewers
- Includes helper methods: `next()`, `nextInt(min, max)`, `nextFloat(min, max)`

**Word Selection Algorithm (sketch.js:121-155)**
```javascript
// Process:
1. Get current timestamp from Date.now()
2. Create SeededRandom instance with timestamp
3. Select 5 unique words from active lexicon
4. Generate random x, y positions and font sizes using same seed
5. Create Word objects with fade lifecycle
```

### Animation & Display System

**Word Lifecycle (sketch.js:40-117)**
Each word has three states:
1. **Fade In** (first 1000ms): alpha 0 → 255
2. **Fully Visible** (middle 3000ms): alpha 255
3. **Fade Out** (last 1000ms): alpha 255 → 0

**Overlapping Transitions**
Words fade out during their last second while new words simultaneously fade in, creating smooth visual continuity.

**Flowing Motion (sketch.js:52-85)**
Each word moves continuously across the canvas:
- Velocity (vx, vy) is seeded-random based on timestamp + character hash
- Speed ranges from 0.3 to 1.2 pixels/frame
- Direction is random (0 to 2π radians)
- Words wrap around canvas edges (with 50px buffer for smooth transitions)
- Motion is deterministic - same word at same time always moves the same way

**Color Assignment (sketch.js:97-112)**
Each word gets a deterministic color from the cybernetics palette based on its character hash:
- Bright green (#00ff00)
- Cyan (#00ffff)
- Light gray (#e0e0e0)
- Amber (#ffaa00)
- Orange (#ff6600)

### Dual Mode System

**Curated Mode (default)**
Uses the 50-word lexicon in `lexicon.js` - themed words from Text & Technology PhD reading lists covering cybernetics, memory, technology, embodiment, theory, and temporality.

**Custom Mode**
- User inputs their own text via textarea
- Text is parsed, filtered (words > 2 characters), and de-duplicated
- Random selection happens from user's vocabulary instead of curated lexicon
- Maintains same timestamp-seeded selection algorithm

### Writing Prompt Generator

**Feature (sketch.js:250-291)**
Interactive feature that generates writing prompts based on currently visible words:
- Filters for words with alpha > 100 (significantly visible)
- Randomly selects from 8 different prompt templates
- Each prompt asks user to write 5 sentences incorporating the visible words
- Prompt display has fade-in animation for visual polish
- Examples: "Write 5 sentences about these floating words: ...", "Compose 5 sentences that weave together: ..."

**UI Integration (index.html:53-62)**
- Button labeled "Generate Prompt"
- Display area shows generated prompt with cyan (#00ffff) styling
- Prompts encourage creative writing inspired by ephemeral word constellations
- Aligns with conceptual framework of distributed authorship and chance operations

### Key Files & Responsibilities

**index.html**
- Page structure with header, canvas container, controls, and footer
- Poetic artist statement (references Ascott, Klüver, Dinkla, Cage)
- UI controls for mode switching and custom text input
- Writing prompt generator section with button and display area

**style.css**
- Cybernetics aesthetic: dark backgrounds (#0a0a0a), green/cyan/orange accents
- Modern sans-serif typography
- Responsive design for mobile/tablet/desktop
- Accessibility support (prefers-reduced-motion)
- Prompt generator styling with orange (#ff6600) accent and fadeIn animation

**sketch.js**
- P5.js setup and draw loop
- SeededRandom class implementation
- Word class with fade animations, color assignment, and flowing motion (velocity + edge wrapping)
- Constellation generation logic
- UI event handlers for mode switching
- Writing prompt generator function with template selection

**lexicon.js**
- Single exported array: `CURATED_LEXICON`
- 50 words across 6 thematic categories
- Used as default vocabulary source

### Performance Considerations

- Canvas size limited to `min(windowHeight * 0.7, 800)` to prevent excessive rendering
- Dead words removed from array immediately after fade out
- Only active words (currently fading/visible) are updated and drawn each frame
- No external dependencies beyond P5.js CDN
