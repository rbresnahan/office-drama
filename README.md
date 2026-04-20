# Blackout Memory Sandbox

A small browser-based narrative engine built around **stable reality, degrading memory, preserved evidence, and player beliefs**.

This is no longer a plain branching CYOA template.

The model is:

- the world has an underlying truth
- the player does **not** get clean access to that truth
- memories fade, compress, distort, or disappear over time
- evidence is more durable than memory
- beliefs influence choices and endings
- endings come from **what the player commits to as true** and what they do with that commitment

## Core Design

### Reality

Reality is consistent under the hood. The engine should always know what actually happened.

### Memory

Memories are not a transcript. They are unstable fragments that degrade as turns pass.

### Evidence

Evidence is externalized information: notes, photos, physical fragments, witness statements, and anything else that survives outside the player character's head.

### Beliefs

Beliefs are interpretations, not facts. They can be right, wrong, incomplete, or emotionally convenient.

## Project Structure

    .
    ├── README.md
    ├── assets
    │   ├── js
    │   │   ├── app.js
    │   │   └── engine
    │   │       ├── effects.js
    │   │       ├── game.js
    │   │       ├── guards.js
    │   │       ├── renderer.js
    │   │       ├── state.js
    │   │       └── story-helpers.js
    │   └── stories
    │       └── demo-story.js
    ├── data.js
    ├── index.html
    ├── main.js
    └── style.css

## What Changed In This Pass

This pass is about **authoring ergonomics only**.

The underlying model is the same, but writing stories is now less repetitive.

New helper file:

- `assets/js/engine/story-helpers.js`

It provides:

- `scene()` for clearer scene declarations
- `choice()` for cleaner choice objects
- `endingNode()` for standard ending scenes
- `paragraphs()` for readable multi-paragraph text
- `status()` for display pill definitions
- `fx.*` builders for effects
- `when.*` builders for reusable conditions
- `read.*` helpers for common state checks

## Authoring Style

Instead of hand-writing repetitive low-level objects like this:

    {
    	type: 'set',
    	path: 'flags.reportMade',
    	value: true,
    }

You can now write:

    fx.set('flags.reportMade', true)

Instead of wiring an ending node manually, you can write:

    ending: endingNode(getEnding)

Instead of hand-writing paragraph joins, you can write:

    text(state) {
    	return paragraphs(
    		'First paragraph.',
    		'Second paragraph.',
    		state.flags.example ? 'Conditional paragraph.' : null
    	);
    }

## Useful Helpers

### Scene helper

    scene({
    	kicker: 'Town Edge',
    	title: 'You still have the crash. For now.',
    	text(state) {
    		return paragraphs(
    			'Paragraph one.',
    			'Paragraph two.'
    		);
    	},
    	choices: [
    		choice('Go to the diner.', 'diner'),
    	],
    })

### Choice helper

    choice('Go to the station.', 'station')

With options:

    choice('Tell Ruiz the truth.', 'station', {
    	condition: when.knowsTag('vehicle:white'),
    	feedback: 'Ruiz waits for something sturdier than confidence.',
    	effects: [
    		fx.set('flags.reportMade', true),
    	],
    })

### Effects helpers

    fx.set('flags.reportMade', true)
    fx.add('stats.stress', 1)
    fx.reinforceMemory('hit-and-run', 10)
    fx.preserveMemory('hit-and-run')
    fx.distortMemory('hit-and-run', falseStage)
    fx.evidence({ ... })
    fx.belief('trust-mara', 'Mara is trying to help.')
    fx.signal('Something shifts.')

### Condition helpers

    when.flag('reportMade')
    when.not(when.flag('reportMade'))
    when.evidence('paint-chip')
    when.belief('trust-mayor')
    when.knowsTag('vehicle:white')
    when.and(when.flag('a'), when.flag('b'))
    when.or(when.evidence('x'), when.evidence('y'))

### Read helpers

Use these inside text functions or custom effect builders:

    read.hasEvidence(state, 'paint-chip')
    read.hasBelief(state, 'trust-mara')
    read.knowsTag(state, 'vehicle:white')
    read.memoryByKey(state, 'hit-and-run')
    read.path(state, 'flags.reportColor')

## Engine Aliases Added

To reduce ceremony, the engine now supports a few aliases:

### Choices

- `condition` or `availableIf`
- `disabledCondition` or `disabledIf`
- `next` or `to`

### Nodes

- `text` or `body`
- `entryFeedback` / `entryEffects` / `entryOnce`
- or a grouped `entry` object:

    entry: {
    	feedback: 'A memory lands.',
    	effects: [fx.signal('Something settles.')],
    	once: true,
    }

### Redirect rules

- `next` or `to`
- `redirectOnce` or `once`

## Running It

Open `index.html` in a browser.

The entry point is `main.js`, which imports `assets/js/app.js`.

## Notes For Future Expansion

Good next additions:

- seeded run variation
- NPC trust states
- memory compression and merging
- case-board style evidence UI
- save/load
- debug tools for inspecting objective truth during authoring

Bad idea too early:

- giant branching trees
- procedural story generation
- fully random lies with no learnable rules