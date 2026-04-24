# Reply All Prototype

A browser-based narrative pressure sandbox built around **unstable information, social propagation, issue containment, degrading certainty, and dirty short-term solutions that leave residue**.

This is no longer just a memory-mystery toy.

The current prototype is aimed at a grounded office crisis:

- you send one bad gossip email
- it goes to the wrong people
- coworkers begin interpreting, spreading, and weaponizing it
- you try to contain the fallout before the office hardens around an official story

The setting is intentionally ordinary because the real subject is not "office comedy."

The real subject is:

**people under pressure acting on unstable information.**

## Current Design Goal

The project is now trying to prove a reusable pressure-logic core through one small, ugly, legible scenario.

The office scenario is the stress test.

It lets the engine exercise:

- active problem objects instead of only loose flags
- per-actor social state
- offscreen propagation
- degrading issue precision under pressure
- containment that can fail later
- underhanded actions with lingering blowback

The abstraction is broader than the theme.

Future skins could still include:

- social sabotage
- trapped-space horror
- corporate dystopia
- sealed-facility survival
- post-collapse rumor systems

But this pass is deliberately focused on making one contained scenario actually work.

## What Changed In This Pass

This pass adds a middle layer the earlier sandbox did not have.

### New engine support

- **Issue objects** with lifecycle, containment, spread risk, severity, and degrading precision.
- **Actor objects** with disposition, suspicion, stability, talkativeness, connections, and per-issue knowledge.
- **Offscreen propagation** so issues can move between actors without direct player input.
- **Issue precision decay** that gets worse when too many unresolved issues exist at once.
- **Actor and issue effect helpers** so story actions can manipulate people and crises directly.
- **Relationship state** so side conflicts can be created instead of only narrated.
- **A logic-board system** with hidden trait truths, player marks, and solve tracking.
- **Generalized sidebar rendering** so the UI can show issues, coworkers, logic, and memory instead of pretending every prototype is the same game.

### Scenario shift

The demo story is now an office-pressure prototype instead of the original blackout investigation sample.

The player is trying to contain a reply-all disaster before an all-hands meeting locks the office into a version of events.

## Core Model

### Reality

The engine still keeps an underlying truth.

### Memory

The player does not keep clean access to every detail. Memory can still fade, compress, distort, or collapse.

### Issues

Problems now exist as explicit world objects.

An issue can be:

- warming
- active
- contained
- reactivated
- resolved

Each issue tracks how severe it is, how fast it can spread, how well it is currently contained, and how precisely the player still understands it.

### Actors

Coworkers are no longer just names inside hand-authored text.

Each actor can track:

- relationship/disposition
- suspicion
- stability
- talkativeness
- issue knowledge
- office connections

The world can also track directional relationships between coworkers so a small lie can create a second-order office fire instead of only a one-line flavor change.

### Logic Board

The office prototype now includes a hidden deduction layer.

A subset of coworkers each has one true value in each logic category.
The player marks cells on the board while learning who is vulnerable to what and which approach works best on them.

The board is not the whole game.
It is the quiet structural layer under the social mess.

### Propagation

The office updates offscreen as turns advance.

People talk. Problems drift. Containment leaks.

The player is not the only thing moving pieces on the board anymore.

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

## Authoring Notes

The story helpers still keep authoring lightweight.

You can still declare scenes with `scene()` and `choice()`.

You now also have effect helpers for actors and issues, such as:

- `fx.actorAdd('betty', 'disposition', 12)`
- `fx.actorKnowledge('tim', 'reply-all', 'heard', 70, 'betty')`
- `fx.issueContain('reply-all', 18)`
- `fx.issueExpose('reply-all', 12)`
- `fx.issueLifecycle('hr-attention', 'active')`
- `fx.issueAdd('reply-all', 'spreadRisk', 8)`

And condition/read helpers for questions like:

- does this actor know the issue?
- how suspicious is HR?
- is the main issue still active?
- how contained is the problem right now?

## Running It

Open `index.html` in a browser.

The entry point is `main.js`, which imports `assets/js/app.js`.

## Next Smart Expansions

Good next additions after this pass:

- location-aware actor movement
- logic truths that mutate into a second connected board after a major event
- reusable propagation rules by relationship type
- player action categories instead of scene-specific handcrafted verbs
- residue dashboards and searchable issue history
 save/load
- debug overlays for actor knowledge and issue truth

Bad idea too early:

- giant office maps
- procedural story generation
- fake AI dialogue systems with no readable state model
- trying to make the engine universal before this slice earns it