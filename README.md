# Lorie's Mosquito Squashing Game

**Small bugs. Big adventure.** A mobile-first arcade game: swat mosquitoes, protect
friendly fireflies, and recruit spiders by drawing loops around them.

[Play on GitHub Pages](https://briangroth.github.io/MosquitoGame/)

## Run locally

No package installation or build step is needed. From this directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open the served page in a browser. Opening `index.html` directly also supports
basic play, but install/offline caching requires HTTPS or localhost. All artwork,
code, and audio generation are local; the game has no third-party requests,
accounts, ads, analytics, or payment integration.

## Adventure

Eight named stages visit Amsterdam Canal, Minnesota Lakefront, Campground, and
Treehouse. The next stage unlocks when you clear the previous quota. Each stage
starts with five health and its own score; Continue resumes at a **stage boundary**.

- Tap a mosquito to swat it. Each consecutive hit grows your streak and score
  multiplier, up to ×3. A bite or missed tap resets the streak.
- Swat a landed mosquito before its countdown ring empties. Five bites end the
  attempt. Friendly hits cost points and streak, never health.
- Circle an idle spider to weave at its visible dotted perch. A finished web
  attracts nearby mosquitoes and holds three catches, including reserved catches
  still being consumed. Its knots show remaining capacity.
- Later encounters add swarms with entry-side warnings, lakeside gusts and
  gold-ringed darters that wind up before diving.
- Pause anytime with the HUD button or Escape. Backgrounding also pauses play.

An interactive practice teaches the three main interactions. Replay it from
Settings or Field guide. Tutorial actions do not earn campaign records.

## Medals, achievements and cosmetics

Each stage has three independent medals: clear the quota, take no bites, and a
stage-specific skill objective. Medals accumulate over retries; you do not have
to earn all three in one attempt. Best score and best streak never decrease.

The field guide tracks eight permanent achievements and lifetime catches/swats.
Rewards include a golden swat effect, golden web silk, journal titles and a
chapter postcard. Unlock and equip rewards through the field guide. Master
Naturalist requires all 24 **standard-mode** medals.

Settings include sound effects, quiet ambience, motion effects, high contrast,
optional haptics and Gentle mode. Device reduced-motion preferences are always
respected. Haptics are used only when the browser supports them; Safari may not.
Gentle mode slows bugs and extends bite timers. Its records and medals are kept
separate from standard records; either mode can unlock the next stage.

## Saves and offline play

Progress is stored on this browser/device under `lories-picnic-v1` in localStorage.
Settings, unlocks, objective medals, achievements, records and lifetime counters
are retained. A stage restarts from its beginning after reload; there is no
mid-stage save. Clearing browser data removes progress. Storage errors show a
message and allow session-only play. Corrupt or newer-version saves are not
silently overwritten.

On HTTPS or localhost the service worker caches the complete game. Let the first
online load finish before playing offline. Install/Add to Home Screen is offered
through the browser's own controls. `manifest.webmanifest` includes PNG app icons;
there is no in-game install prompt. Scope-relative URLs support GitHub Pages.

When shipping changed assets, bump the cache version in `sw.js`. The worker waits
for existing clients to close before activating a new release, avoiding mixed
asset versions during play. No remote leaderboard or cloud sync is implemented.

## Code and tests

- `game.js`: simulation, original Canvas scene/insect artwork, input, game flow,
  tutorial and UI rendering.
- `progression.js`: stage definitions, validated saves, medal/achievement rules
  and synthesized audio. Also exports a CommonJS API for tests.
- `style.css`: responsive field-journal menus, HUD and accessibility settings.
- `assets/picnic.webp`: original AI-generated home illustration, optimized to WebP.
- `sw.js`, `manifest.webmanifest`, `icon.svg`: offline/install packaging.

Run the progression regression tests with Node 18+:

```sh
node --test tests/progression.test.cjs
```

They cover medal accumulation, records, mode separation, achievement thresholds,
restoration, storage failures and corrupt/future saves. Manual device QA should
include iPhone Safari, audio interruptions, multitouch/cancelled gestures,
background/resume, safe areas, rotation and offline reload. Desktop Chromium
checks do not establish native iPhone behavior.

This release implements the eight-stage foundation. Score-attack, seeded daily
challenges, online leaderboards, a larger campaign and purchases are future work.
