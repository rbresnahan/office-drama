# Changelog

## Unreleased

### 2026-05-05 12:05 PM CT — Narrative Interaction Layer Pass

Reference slug: `office-panic-narrative-layer-pass-2026-05-05`

This update added the first full narrative interaction layer pass for Office Panic. The goal was to make the office feel reactive instead of feeling like button chess.

### Added

- Added narrative interaction layer documentation and implementation scope.
- Added discovery-gated Frank bottle route.
- Added visible aftermath beats for office motion.
- Added hidden office motion through existing hidden event patterns.
- Added schedule clarity modal showing Start, Stand Up, Lunch, Afternoon Checkup, and All-Hands.
- Added Devon forced approach scenes.
- Added Frank forced reaction scene.
- Added Tim procedural challenge scene.

### Changed

- Updated schedule language to Stand Up, Lunch, Afternoon Checkup, and All-Hands.
- Standardized player-facing Devon spelling.
- Tuned event priority so visible aftermath can resolve before scheduled meetings.
- Tuned Frank forced-scene ordering so Frank does not interrupt directly from the break room.
- Preserved existing engine systems instead of adding a new NPC simulation layer.

### Fixed

- Prevented duplicate schedule button click handlers from accumulating across renders.
- Prevented scheduled meetings from swallowing pending visible aftermath before the player sees office reactions.

### Notes

- This pass intentionally used existing mechanics first: facts, requirements, hidden events, visible aftermath, forced rules, schedule events, feedback, latest signals, bars, and used choices.
- No full NPC simulation system was added.
- No inventory system was added.
- No broad engine rewrite was performed.
- Recommended next step is an integrated playtest and tuning pass before adding more content.