# Reply All

A browser-based office sabotage prototype built around one bad email, partial recall failure, social spread, and late-stage fallout management.

## Current Design Goal

The current prototype is focused on one small but nasty scenario:

- you send a bad email about one coworker
- recall only partially works
- some people receive it
- some people read it
- you try to stop the office from hardening around the worst version of events
- if the subject reads it early, the run shifts into end-game / defensive mode
- the ideal outcome is that the subject first learns about it at the all-hands, under conditions the player has shaped

This is not trying to be a giant human simulator.

It is trying to prove a small, replayable pressure system with:
- concrete actions
- social propagation
- hidden player sentiment
- relationship-driven spread
- readable escalation
- and a strong public climax

## Prototype Pillars

### 1. One selected subject
Each run selects one existing NPC as the subject of the email.

### 2. Partial recall
The player can never fully unsend the email.
The opening state is created by who received it and whether they have read it.

### 3. Fair intervention
If the subject got the email, the player must still get at least one meaningful chance to intervene before the subject auto-reads it.

### 4. Per-turn spread
The office updates in turns.
People tell allies, escalate upward, or carry rumors based on who they are and what the player failed to contain.

### 5. End-game shift
Once the subject reads the email, the run is no longer clean prevention.
It becomes fallout management, reframing, scapegoating, and survival.

### 6. All-hands payoff
The all-hands is the public resolution chamber.
It should reflect the room the player created, not just one final button press.

## Current Cast

Prototype 1 uses six NPCs:

- Betty
- Tim
- Frank
- Celia
- Devon
- Lisa

These six are enough to support:
- a strong social alliance
- a procedural alliance
- a player-trust relationship
- a fact-driven outlier
- blame shifts
- rumor chains
- intervention risk
- and replayable variation

## Core Design Docs

The design-side source of truth lives in `docs/`.

Important files:
- `docs/legend.md`
- `docs/relationships.md`
- `docs/actions-phase-1.md`
- `docs/email-spread.md`
- `docs/spread-resolution.md`
- `docs/all-hands-rules.md`
- `docs/run-setup.md`
- `docs/npcs/`

These files are used to lock system meaning before implementation changes are made.

## Current Project Structure

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
    ├── docs
    │   ├── README.md
    │   ├── STATUS.md
    │   ├── actions-phase-1.md
    │   ├── all-hands-rules.md
    │   ├── email-spread.md
    │   ├── legend.md
    │   ├── npcs
    │   │   ├── betty.md
    │   │   ├── celia.md
    │   │   ├── devon.md
    │   │   ├── frank.md
    │   │   ├── lisa.md
    │   │   ├── npc-template.md
    │   │   └── tim.md
    │   ├── relationships.md
    │   ├── run-setup.md
    │   └── spread-resolution.md
    ├── index.html
    ├── main.js
    └── style.css

## Current Engine Reality

The codebase still contains earlier prototype structures and UI elements from the prior sandbox phase.

That is fine.

The next implementation pass should focus on translating the current docs into live story data and state before doing broader cleanup.

In other words:
- do not rebuild the engine first
- move the live design into data first
- then wire behavior to it
- then simplify whatever no longer belongs

## Running It

Serve locally and open in a browser.

Example:

    python3 -m http.server 8000

Then visit:

    http://localhost:8000

## Development Rule

Prototype first.

Do not expand scope just because a system sounds interesting.

Priority order:
1. readable systems
2. concrete actions
3. reactive social fallout
4. strong public climax
5. replayability

Not priority:
- giant realism
- huge cast
- perfect simulation
- procedural dialogue sludge