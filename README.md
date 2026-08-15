# MosquitoGame

Lorie's Mosquito Squashing Game — a mobile web game for Safari on iPhone.

Tap mosquitoes before they land on your arm and drain your blood. Pick where you
want to play, then survive eight levels of it.

**Play:** https://briangroth.github.io/MosquitoGame/

## Running it

Open `index.html`. That's the whole thing — one file, inline CSS and JS,
Canvas-drawn artwork, no build step, no dependencies, no network requests.
It works equally well opened from disk or served by GitHub Pages.

## Scenes

You choose the scene on the title screen — from thumbnails rendered live by the
same Canvas code that draws the real thing — and it stays put for the whole
game. Only the bugs escalate. The light does move on: levels 1–4 play in
daylight, 5–8 in evening light, so your chosen place still has somewhere to go.

- Amsterdam canal
- Minnesota lakefront
- Campground
- Treehouse

## Rules

- Tap a mosquito to squash it. Consecutive hits build a combo multiplier up to ×3.
- A mosquito that reaches your forearm starts biting, shown by a countdown ring.
  Swat it before the ring empties or it takes one of your five drops of blood.
- Clearing a level's quota advances the level and returns one drop.
- Lose all five drops and the mosquitoes win.

### Friendly bugs — don't squash these

**Fireflies** drift slowly and glow warm yellow-green; **spiders** scuttle along
and pause. Squashing either costs you `20 × level` points and your combo. It
never costs blood — that stays reserved for actual bites, so the two kinds of
mistake stay legible.

### Spiders and webs

**Draw a circle around a spider with your finger.** It crawls to a nearby
opening and spins a web there. Any mosquito that flies into a live web is stuck
and then eaten, which counts toward your quota and scores `6 × level` — less
than a swat, and it builds no combo, because it rewards setting the trap rather
than reflexes. A web holds three mosquitoes, then fades and frees the spider to
be circled again.

A tap and a lasso are told apart by distance travelled: under 14px is a tap,
anything more is a loop. Mosquitoes resolve on touch-*down* so swatting stays
instant, while friendly bugs only resolve on touch-*up* — which is what makes it
safe to start drawing a loop right next to a firefly.

### Swarms

From level 3, swarms arrive all at once from one side. A swarm deliberately
ignores the steady-state concurrency cap — that spike is the point of it.

## Difficulty

Every value scales from the level number `L` (1–8) by an explicit formula, also
shown on the title screen:

```
quota      = 5 + 2(L-1)                    mosquitoes to squash
speed      = 55 + 20(L-1)                  px/sec
onscreen   = min(2 + floor(0.8(L-1)), 7)   concurrent mosquitoes
spawn gap  = max(0.35, 1.40 - 0.14(L-1))   seconds
bite timer = max(1.00, 2.40 - 0.18(L-1))   seconds to swat a biter
swarm every  max(6, 15 - 1.5(L-3))         seconds, from L3
swarm size   min(3 + floor((L-3)/2), 6)    mosquitoes
fireflies  = min(1 + floor((L-1)/2), 4)    concurrent
spiders    = 1, or 2 from L6               concurrent
```

A full run is 96 mosquitoes.

## Mobile notes

Touch targets are 68pt across, well over the 44pt iOS minimum, and taps resolve
to the nearest mosquito within that radius rather than requiring a pixel-perfect
hit. The bite zone is held clear of the bottom edge so it never lands under
Safari's toolbar. Browser pinch-zoom, double-tap-zoom and rubber-band scrolling
are all suppressed over the play area, and nothing depends on hover.
