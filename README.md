# MosquitoGame

Lorie's Mosquito Squashing Game — a mobile web game for Safari on iPhone.

Tap mosquitoes before they land on your arm and drain your blood. Eight levels
across four outdoor places where mosquitoes actually show up.

**Play:** https://briangroth.github.io/MosquitoGame/

## Running it

Open `index.html`. That's the whole thing — one file, inline CSS and JS,
Canvas-drawn artwork, no build step, no dependencies, no network requests.
It works equally well opened from disk or served by GitHub Pages.

## Scenes

Levels cycle through four Canvas-drawn backgrounds, each played twice — once in
daylight, once in evening light:

| Level | Scene |
|-------|-------------------------|
| 1 / 5 | Amsterdam canal |
| 2 / 6 | Minnesota lakefront |
| 3 / 7 | Campground |
| 4 / 8 | Treehouse |

## Rules

- Tap a mosquito to squash it. Consecutive hits build a combo multiplier up to ×3.
- A mosquito that reaches your forearm starts biting, shown by a countdown ring.
  Swat it before the ring empties or it takes one of your five drops of blood.
- Clearing a level's quota moves you to the next scene and returns one drop.
- Lose all five drops and the mosquitoes win.

## Difficulty

Every value scales from the level number `L` (1–8) by an explicit formula, also
shown on the title screen:

```
quota      = 5 + 2(L-1)                    mosquitoes to squash
speed      = 55 + 20(L-1)                  px/sec
onscreen   = min(2 + floor(0.8(L-1)), 7)   concurrent mosquitoes
spawn gap  = max(0.35, 1.40 - 0.14(L-1))   seconds
bite timer = max(1.00, 2.40 - 0.18(L-1))   seconds to swat a biter
```

A full run is 96 mosquitoes.

## Mobile notes

Touch targets are 68pt across, well over the 44pt iOS minimum, and taps resolve
to the nearest mosquito within that radius rather than requiring a pixel-perfect
hit. The bite zone is held clear of the bottom edge so it never lands under
Safari's toolbar. Browser pinch-zoom, double-tap-zoom and rubber-band scrolling
are all suppressed over the play area, and nothing depends on hover.
