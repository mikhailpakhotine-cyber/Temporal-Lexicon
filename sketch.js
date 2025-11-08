// Temporal Lexicon Generator - P5.js Sketch
// Uses timestamp-seeded randomness for deterministic word selection

// === Configuration ===
const UPDATE_INTERVAL = 5000; // 5 seconds
const CONSTELLATION_SIZE = 5; // 5 words at a time
const FADE_DURATION = 1000; // 1 second fade in/out

// === State ===
let currentWords = [];
let currentMode = 'curated';
let customLexicon = [];
let lastUpdateTime = 0;

// === Seeded Random Number Generator ===
// Mulberry32 - simple and effective PRNG
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    next() {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    // Get random integer between min (inclusive) and max (exclusive)
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min)) + min;
    }

    // Get random float between min and max
    nextFloat(min, max) {
        return this.next() * (max - min) + min;
    }
}

// === Word Object ===
class Word {
    constructor(text, x, y, size, seed) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.birthTime = millis();
        this.deathTime = this.birthTime + UPDATE_INTERVAL;
        this.alpha = 0;

        // Add flowing motion with seeded velocity
        const rng = new SeededRandom(seed + text.charCodeAt(0));
        const speed = rng.nextFloat(0.3, 1.2);
        const angle = rng.nextFloat(0, TWO_PI);
        this.vx = cos(angle) * speed;
        this.vy = sin(angle) * speed;
    }

    update() {
        const now = millis();
        const age = now - this.birthTime;
        const timeUntilDeath = this.deathTime - now;

        // Fade in during first FADE_DURATION ms
        if (age < FADE_DURATION) {
            this.alpha = map(age, 0, FADE_DURATION, 0, 255);
        }
        // Fade out during last FADE_DURATION ms
        else if (timeUntilDeath < FADE_DURATION) {
            this.alpha = map(timeUntilDeath, 0, FADE_DURATION, 0, 255);
        }
        // Fully visible in between
        else {
            this.alpha = 255;
        }

        // Update position with velocity
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
    }

    display() {
        push();
        fill(this.getColor());
        textSize(this.size);
        textAlign(CENTER, CENTER);
        text(this.text, this.x, this.y);
        pop();
    }

    getColor() {
        // Cybernetics color palette with alpha
        const colors = [
            [0, 255, 0],      // Bright green
            [0, 255, 255],    // Cyan
            [224, 224, 224],  // Light gray
            [255, 170, 0],    // Amber
            [255, 102, 0]     // Orange
        ];

        // Use text hash to deterministically assign color
        const hash = this.text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const colorIndex = hash % colors.length;
        const [r, g, b] = colors[colorIndex];

        return color(r, g, b, this.alpha);
    }

    isDead() {
        return millis() > this.deathTime;
    }
}

// === Word Selection ===
function selectWordsFromLexicon(timestamp, lexicon) {
    if (lexicon.length === 0) return [];

    const rng = new SeededRandom(timestamp);
    const selectedWords = [];
    const availableWords = [...lexicon];

    // Select 5 unique words (or fewer if lexicon is small)
    const count = Math.min(CONSTELLATION_SIZE, availableWords.length);

    for (let i = 0; i < count; i++) {
        const index = rng.nextInt(0, availableWords.length);
        selectedWords.push(availableWords[index]);
        availableWords.splice(index, 1);
    }

    return selectedWords;
}

// === Generate Constellation ===
function generateConstellation(timestamp) {
    const lexicon = currentMode === 'curated' ? CURATED_LEXICON : customLexicon;
    const words = selectWordsFromLexicon(timestamp, lexicon);

    const rng = new SeededRandom(timestamp);
    const margin = 80;

    words.forEach(wordText => {
        const x = rng.nextFloat(margin, width - margin);
        const y = rng.nextFloat(margin, height - margin);
        const size = rng.nextFloat(24, 72); // Varying font sizes

        currentWords.push(new Word(wordText, x, y, size, timestamp));
    });
}

// === P5.js Setup ===
function setup() {
    const canvas = createCanvas(windowWidth, min(windowHeight * 0.7, 800));
    canvas.parent('canvas-container');

    textFont('Helvetica, Arial, sans-serif');

    // Generate initial constellation
    lastUpdateTime = Date.now();
    generateConstellation(lastUpdateTime);

    // Set up UI event listeners
    setupUIListeners();
}

// === P5.js Draw Loop ===
function draw() {
    background(10, 10, 10); // Deep black

    // Check if we need to generate new words
    const currentTime = Date.now();
    const timeSinceUpdate = currentTime - lastUpdateTime;

    if (timeSinceUpdate >= UPDATE_INTERVAL) {
        lastUpdateTime = currentTime;
        generateConstellation(currentTime);
    }

    // Update and display all words
    for (let i = currentWords.length - 1; i >= 0; i--) {
        const word = currentWords[i];
        word.update();
        word.display();

        // Remove dead words
        if (word.isDead()) {
            currentWords.splice(i, 1);
        }
    }
}

// === Window Resize Handler ===
function windowResized() {
    resizeCanvas(windowWidth, min(windowHeight * 0.7, 800));
}

// === UI Event Listeners ===
function setupUIListeners() {
    // Mode selector radio buttons
    const radioButtons = document.querySelectorAll('input[name="mode"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentMode = e.target.value;

            // Show/hide custom input
            const customContainer = document.getElementById('customInputContainer');
            if (currentMode === 'custom') {
                customContainer.style.display = 'block';
            } else {
                customContainer.style.display = 'none';
            }

            // Reset constellation
            resetConstellation();
        });
    });

    // Custom text apply button
    const applyButton = document.getElementById('applyCustom');
    applyButton.addEventListener('click', () => {
        const customText = document.getElementById('customText').value;

        // Parse custom text into words
        customLexicon = customText
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2) // Filter out very short words
            .filter((word, index, self) => self.indexOf(word) === index); // Remove duplicates

        if (customLexicon.length > 0) {
            resetConstellation();
        } else {
            alert('Please enter some text (at least a few words).');
        }
    });

    // Prompt generator button
    const promptButton = document.getElementById('generatePrompt');
    if (promptButton) {
        promptButton.addEventListener('click', generateWritingPrompt);
    }
}

// === Writing Prompt Generator ===
function generateWritingPrompt() {
    // Get currently visible words (those with significant alpha)
    const visibleWords = currentWords
        .filter(word => word.alpha > 100)
        .map(word => word.text);

    const promptDisplay = document.getElementById('promptDisplay');

    if (visibleWords.length === 0) {
        promptDisplay.textContent = "Waiting for words to appear...";
        promptDisplay.style.opacity = '0.5';
        return;
    }

    // Create list of words for display
    const wordList = visibleWords.join(', ');

    // Generate the prompt
    const prompts = [
        `Write 5 sentences about these floating words: ${wordList}`,
        `Compose 5 sentences that weave together: ${wordList}`,
        `In 5 sentences, explore the constellation of: ${wordList}`,
        `Create 5 sentences connecting these drifting concepts: ${wordList}`,
        `Write 5 sentences meditating on: ${wordList}`,
        `Compose 5 sentences as these words float before you: ${wordList}`,
        `In 5 sentences, trace the relationships between: ${wordList}`,
        `Write 5 sentences inspired by the ephemeral presence of: ${wordList}`
    ];

    // Select random prompt
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    promptDisplay.textContent = randomPrompt;
    promptDisplay.style.opacity = '1';

    // Add fade-in effect
    promptDisplay.style.animation = 'none';
    setTimeout(() => {
        promptDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);
}

// === Reset Constellation ===
function resetConstellation() {
    currentWords = [];
    lastUpdateTime = Date.now();
    generateConstellation(lastUpdateTime);
}
