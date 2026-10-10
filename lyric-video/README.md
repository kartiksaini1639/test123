# Lyric Video Studio

A single-page tool that turns a song and its lyrics into an animated lyric video, all in the browser.

## Use it

1. Open `index.html` in Chrome or Firefox.
2. **Audio:** pick the song file.
3. **Lyrics:** paste them in (one line per row) or load a `.txt` file. Lines wrapped in `(parentheses)` show up as comic speech bubbles, which suits skits and spoken parts.
4. **Timing:**
   - **Tap-sync** plays the song. Press `Space` as each line starts, `Backspace` to undo, `Esc` to stop.
   - **Auto-spread** spaces the lines across the vocal section instead.
   - Timings are saved in your browser. You can also save them to, or load them from, a JSON file.
5. **Export:** **Record video** plays the song once in real time and downloads a 1280×720 `.webm` file with audio. Keep the tab visible while it records.

## Effects

- Words animate in one at a time. Each line uses one of six styles, picked at random: slam, typewriter, glitch, wave, stack or split.
- The background reacts to the audio: a spectrum ring, halftone dots that pulse with the bass, and an oscilloscope line.
- On each detected beat, the picture zooms in slightly and the text gets an RGB split.
- VHS grain, scanlines, a vignette and letterbox bars sit on top.
- **Keyword triggers:** certain words get their own colour, a glow and an underline. Many also pop in a hand-drawn object, set off a particle effect, or both. For example:
  - *beer* → a bottle and bubbles
  - *mic* → a microphone
  - *mask* → an iron mask
  - *money* → falling cash
  - *heat* → a flame and a flash
  - *watermelon* / *seeds* → a melon slice and spat seeds
  - *pizza* → a pizza slice
  - *world* → a globe
  - *snow* → snowfall
  - *chicken* → a chicken and feathers
  - *snappin* → a camera flash
  - *floor* → a screen drop
  - *one two three* → big numbers

  The full list is the `TRIGGERS` table in `index.html`, and you can add your own.
