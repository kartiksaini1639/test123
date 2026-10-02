# Ghost Town — Production Pack

A 2-minute-20 Vox-style explainer on Kanye West's *Ghost Town*, set up so you can make every part yourself, with whatever tools you have and as cheaply as possible.

| File | What it is |
|---|---|
| `01-shot-list.md` | 16 shots, each with a full image prompt, a detailed animation prompt, on-screen text, timing, transition and sound-effect notes |
| `02-voiceover.md` | Narration with delivery notes, pause markers, and clean per-line text for text-to-speech |
| `03-music.md` | Background music brief, a ready-to-paste AI music prompt, and a timed music map |
| `script.json` | The same script in machine-readable form, if you later run the automated `vox-explainer` skill |
| `brief.md` | Topic, angle and facts to check before publishing |

## Order of work
1. **Check the facts** listed in `brief.md`.
2. **Record the voiceover** (`02-voiceover.md`), one file per beat. Note each file's real length.
3. **Make Shot 1's image.** Tweak until the style feels right, because every other shot copies its look.
4. **Make the other 15 images**, using Shot 1 as a style reference where your tool allows it.
5. **Animate each image** with its animation prompt. Generate at least the voiceover length plus 0.5s. If your tool only offers 5s or 10s, pick the next size up and trim the clip later.
6. **Get the music** (`03-music.md`).
7. **Edit** in any free video editor:
   - Put the clips in order and trim each one to its voiceover length plus 0.5s.
   - Lay the voiceover on track 1 and the music on track 2. Duck the music under the voice.
   - Add subtitles. Most free editors can auto-caption from the voiceover track.
   - Export at 1920×1080, 30fps, H.264.

## Subtitle style
Bold heavy sans-serif font (Archivo Black, Arial Black, Montserrat ExtraBold or similar), white with a 3–4px black outline, bottom-centre, at most 2 lines of about 42 characters each. Break lines at commas and full stops, never mid-phrase. You can optionally colour one key word per caption in gold (#D4A017).

## Keeping costs down
- **Voiceover:** record it yourself for free.
- **Music:** use a free royalty-free library track.
- **Images:** this is the cheap part. Most free tiers cover 16 images plus retries.
- **Animation:** this is the expensive part. To save money:
  - Use your image tool's free tier, and animate only the "hero" shots (1, 4, 8, 11, 14, 16).
  - For the other shots, use your editor's built-in slow zoom or pan on the still image (often called "Ken Burns" or "zoom"). It suits this collage style and costs nothing.
  - Make a cheap low-resolution draft first, and spend credits only on the shots that need to be redone.
