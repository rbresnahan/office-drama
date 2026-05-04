# Phase 10: Story Validation

Phase 10 adds a lightweight local validator for the Office Panic story files.

This does not change game behavior. It exists to protect future-you from breaking scene IDs, choice IDs, bar references, aftermath links, or rule targets while editing the modular Phase 9 story files.

## Why this exists

Before Phase 9, most story content lived in one large file:

`assets/stories/demo-story.js`

That worked, but it became painful to edit.

Phase 9 split the story into smaller modules under:

`assets/stories/demo/`

That made editing easier, but it also created a new risk: one typo in a scene ID, choice ID, bar ID, or aftermath ID can quietly break the game.

Phase 10 adds a validator so we can catch those mistakes before playtesting.

## Files added in Phase 10

Phase 10 adds:

`tools/validate-story.mjs`

It also adds npm scripts in:

`package.json`

## Commands

Run normal validation:

`npm run validate:story`

Run strict validation:

`npm run validate:story:strict`

## Normal validation

Normal validation fails on errors.

Warnings are allowed.

Use this most of the time while editing story files.

Example:

`npm run validate:story`

If there are no errors, the story is probably safe to playtest.

## Strict validation

Strict validation fails on both errors and warnings.

Example:

`npm run validate:story:strict`

Use this when you want a cleaner final check before committing.

Strict mode may be too picky during active development, especially if we intentionally leave future placeholders or unused unlock references.

## What counts as an error

Errors are things that are likely to break the game.

Examples:

- A scene points to a missing `nextScene`.
- A schedule event points to a missing scene.
- A backlash rule points to a missing scene.
- A forced rule points to a missing scene.
- A choice references a bar that does not exist.
- A choice queues a visible aftermath ID that does not exist.
- A scene is missing a required title.
- A choice ID is duplicated.
- A story config scene ID points to a scene that does not exist.

Errors should be fixed before playtesting.

## What counts as a warning

Warnings are things that may be intentional but are worth checking.

Examples:

- A scene key and internal scene ID do not match.
- An aftermath key and internal aftermath ID do not match.
- A scene is missing location text.
- A choice unlocks a choice ID the validator does not currently see.
- A choice is missing button text.

Warnings do not stop normal validation.

Warnings do stop strict validation.

## Why unlock warnings may happen

Some choices use `effects.unlocks`.

The validator checks whether those unlock IDs exist as choice IDs.

If an unlock points to a future placeholder or a choice that has not been implemented yet, normal validation reports a warning.

That is okay during development.

If the unlock should point to an existing choice, fix the typo.

## What this validator does not do

The validator does not test whether the story is balanced.

It does not test whether a route is fun.

It does not test whether the player has enough turns.

It does not test whether prose is good.

It does not simulate a full playthrough.

It only checks structural safety.

Basically, it makes sure the wires are connected before we argue about whether the toaster has feelings.

## When to run it

Run this after editing any story file:

`npm run validate:story`

Especially run it after editing files in:

`assets/stories/demo/scenes/`

`assets/stories/demo/finale/`

`assets/stories/demo/aftermath.js`

`assets/stories/demo/backlash-rules.js`

`assets/stories/demo/forced-rules.js`

`assets/stories/demo/schedule.js`

`assets/stories/demo/bars.js`

## Recommended workflow

1. Edit the story file you care about.
2. Run `npm run validate:story`.
3. Fix any errors.
4. Playtest the route.
5. Commit the story change once it works.

Before a bigger commit, optionally run:

`npm run validate:story:strict`

## Common fixes

If validation says a scene is missing, check:

- The scene file exists.
- The scene is imported in `assets/stories/demo/index.js`.
- The scene is included inside the `scenes` object.
- The scene ID matches the key used by choices and rules.

If validation says a choice ID is duplicated, search for that ID across:

`assets/stories/demo/scenes/`

Choice IDs should be globally unique.

If validation says a bar is unknown, check:

`assets/stories/demo/bars.js`

Then check the spelling in the choice effect or requirement.

If validation says an aftermath ID is missing, check:

`assets/stories/demo/aftermath.js`

Then check the spelling in `queueVisibleAftermath`.

## Important rule

The validator imports the actual story through:

`assets/stories/demo-story.js`

That means it validates the same public story object the game uses.

This is good.

Do not make the validator import random scene files directly unless there is a strong reason. The goal is to validate the final assembled story object.

## Phase 10 success criteria

Phase 10 is successful when:

- `npm run validate:story` runs.
- Errors are reported clearly.
- Warnings are reported separately.
- The game still runs the same as Phase 9.
- Future story edits are safer.
- Broken IDs get caught before playtesting.

## Mental model

Phase 9 made the story easier to edit.

Phase 10 makes the story harder to accidentally break.

This is not a CMS.

This is not a build system.

This is a seatbelt.