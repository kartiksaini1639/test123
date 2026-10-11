# Spectre: dry-down in one take

A 30-second vertical promo film for **Spectre** (Aromak, Eau de Parfum).

| file | what |
|---|---|
| `spectre_final_1080x1920_60fps.mp4` | the final film: 1080×1920, 60 fps, with music |
| `spectre_final_share.mp4` | the same film, more compressed (~25 MB) for sending |
| `project/` | the source: an HTML composition (`comp.html`), the cut-out assets, and the score script |

## Beats

1. The valley, full bleed, with mist. "Wide-open landscapes, in one bottle." The bottle turns 360° in place.
2. The camera dives into the glass and descends through the notes: **Fresh Spicy** (Calabrian Bergamot, Pepper) →
   **Spicy Floral** (Sichuan Pepper, Lavender) → **Warm Woody** (Ambroxan, Cedar), with the ingredients floating.
3. A whip back out, then BOLD · FRESH · WOODY.
4. SPECTRE with callout lines to each note, sizes (12 / 50 / 100 ml), from ₹250, handcrafted in Kannauj.
5. A push into the label's mark, black, the AROMAK logo.

## Notes

- The end-card logo is a vector redraw. The original logo file was not available; swap it into `buildLogo()` in
  `comp.html`, or replace the drawn logo with an image.
- The music and sound effects are synthesized by `project/score2.py` (no samples or licensed tracks).
- Made with the [onetake](https://github.com/feitangyuan/onetake) skill. `project/motion.js` comes from it and is
  under the PolyForm Noncommercial 1.0.0 licence.

## Re-rendering

With the onetake skill installed (`~/.claude/skills/onetake`), Python Playwright and ffmpeg:

```bash
python3 ~/.claude/skills/onetake/scripts/render.py project/comp.html --width 1080 --height 1920 --fps 60 \
  --out spectre_final.mp4 --sfx project/score2.wav
```
