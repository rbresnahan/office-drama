# Choice Weighting Rules

Use existing `effects.bars` values as the choice-weighting model. Do not add a new engine layer unless a story needs behavior that simple bar deltas and requirements cannot express.

## Weight Bands

Light choices are probes, questions, hints, and low-commitment nudges.

Typical bar change: `5` to `10`.

Medium choices are soft rumors, implications, mild redirects, and social pressure.

Typical bar change: `10` to `20`.

Heavy choices are committed lies, direct accusations, strong narrative pushes, and risky manipulation.

Typical bar change: `25` to `35`.

Major choices are irreversible acts, planted evidence, public commitments, and major confrontations.

Typical bar change: `40` to `50`.

## Route Design

A route should not become complete through light choices alone. Light choices can reveal context and make a route plausible, but heavy and major actions should carry the decisive progress.

When writing a route, make early choices available broadly, then gate heavier choices with existing requirements such as `phaseMin`, `flagsAll`, `flagsAny`, `barsMin`, `usedChoicesAll`, `factsAll`, or `hiddenEventsAll`.

Major actions should feel optional tactically, not optional mathematically. If a planted item or public accusation is meant to be the decisive escalation, do not let smaller questions pay enough to make that escalation irrelevant.

## Retaliation Delay

Threat retaliation should usually start when the target plausibly knows they are being aimed at.

Good gates include:

- a rumor-spread flag
- a hidden event showing the rumor traveled
- a forced scene where the target hears their name
- a public or physical escalation

For Frank-style frame routes, early suspicion can raise the frame bar without raising retaliation. Retaliation should rise after events such as `frankHeardRumor`, `devon_spreads_frank_story`, `betty_told_lisa_frank_suspicion`, or a planted-evidence action.
