# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Temporal-Lexicon is a web-based system that generates words from an input text every few seconds, using the current timestamp as the seed for randomness. This creates a deterministic yet time-varying word generation experience.

## Project Status

This is a newly initialized repository. The project structure and tooling have not yet been established.

## Development Setup

*To be added once the project stack is chosen (e.g., React, Vue, vanilla JS, etc.)*

### Prerequisites
*To be documented based on chosen technology stack*

### Installation
*To be documented once package manager and dependencies are established*

### Running the Application
*To be documented once build system is set up*

### Testing
*To be documented once testing framework is chosen*

## Architecture Notes

### Core Concept
The application's unique feature is using `Date.now()` or similar timestamp functions as a seed for randomness, ensuring that:
- Word selection is deterministic for any given timestamp
- Different words appear as time progresses
- The sequence can be reproduced by using the same timestamp

### Key Technical Considerations
When implementing, ensure:
- The random seed calculation is consistent and predictable
- The word generation algorithm properly utilizes the timestamp seed
- The UI updates smoothly at the configured interval (every few seconds)
- Input text parsing handles edge cases appropriately
