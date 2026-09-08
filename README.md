# Sister 1 — Premium Interactive Birthday Experience

A client-side cinematic birthday experience built with HTML, CSS and JavaScript modules.

## 1. Run locally

No backend is required.

Option A — VS Code Live Server:
- Open this folder in VS Code.
- Start Live Server.
- Open `index.html`.

Option B — Node:
```bash
npx serve .
```
Then open the local address it prints.

A local server is recommended because browsers handle local media and module loading more reliably over HTTP than with `file://`.

## 2. Main configuration

Edit:

`js/config.js`

Change:
- `sisterName`
- `oldAge`
- `newAge`
- `answerOptions`
- `correctAnswer`
- `calmMessage`
- `letterText`
- asset filenames
- celebration duration
- NO-click limit

The intended example is:
```js
const birthdayConfig = {
  sisterName: "SISTER NAME",
  oldAge: "25",
  newAge: "26",
  answerOptions: ["OPTION 1", "OPTION 2", "OPTION 3", "OPTION 4"],
  correctAnswer: "SISTER NAME"
};
```

## 3. Personal text

You can either put the text directly in `js/config.js`, or load it into that configuration yourself.

Place reference text files here:
- `content/calm-message.txt`
- `content/sister-letter.txt`

The runtime currently uses the config values so the project remains dependency-free and easy to customize.

## 4. Complete resource map

### Scene 1 — Question / wrong answer / correct answer

| Resource | Exact path | Recommended format |
|---|---|---|
| Wrong-answer voice | `assets/audio/wrong-answer.mp3` | MP3 |
| Funny cat video | `assets/videos/cat-correct-answer.mp4` | MP4 / H.264 |
| Cake | `assets/images/cake.png` | PNG/WebP |
| Correct-answer blast | `assets/effects/correct-answer-blast.png` | PNG/WebP |

### Scene 2 — Curtains

| Resource | Exact path | Recommended format |
|---|---|---|
| Left curtain | `assets/images/curtain-left.png` | PNG/WebP |
| Right curtain | `assets/images/curtain-right.png` | PNG/WebP |

If you prefer a curtain video, replace the implementation/resource references in `js/config.js` and `js/scenes.js`.

### Scene 3 — Bulb and lights

| Resource | Exact path | Recommended format |
|---|---|---|
| Bulb | `assets/images/bulb.png` | PNG/WebP |
| Hanging/decorative lights | `assets/images/hanging-lights.png` | PNG/WebP |

The light activation currently has a CSS/scene fallback; the resource is ready for integration.

### Scene 4 — Music

| Resource | Exact path | Recommended format |
|---|---|---|
| Music icon | `assets/icons/music.png` | PNG/WebP |
| Happy Birthday song | `assets/audio/happy-birthday.mp3` | MP3 |

Music starts only after the user clicks the music button.

### Scene 5 — Age reveal

| Resource | Exact path | Recommended format |
|---|---|---|
| Burning age animation | `assets/effects/age-burning-25-to-26.mp4` | MP4 / H.264 |

If this video is absent, the built-in CSS fallback performs:
`old age → burns/fades → new age appears`.

If the age changes, rename the configured path or use a generic asset filename and update `js/config.js`.

### Scene 6 — Celebration

| Resource | Exact path | Recommended format |
|---|---|---|
| Red balloon | `assets/images/balloon-red.png` | PNG/WebP |
| Blue balloon | `assets/images/balloon-blue.png` | PNG/WebP |
| Yellow balloon | `assets/images/balloon-yellow.png` | PNG/WebP |
| Pink balloon | `assets/images/balloon-pink.png` | PNG/WebP |
| Fireworks | `assets/effects/fireworks.png` | PNG/WebP |
| Paper blaster | `assets/effects/paper-blaster.png` | PNG/WebP |
| Replay icon | `assets/icons/celebration-replay.png` | PNG/WebP |

The current celebration uses efficient CSS/DOM effects as a functional fallback rather than depending on these files.

### Scene 7 — Calm photo

| Resource | Exact path | Recommended format |
|---|---|---|
| Sister portrait | `assets/images/sister-photo-01.jpg` | JPG/WebP |

Use a 9:16 portrait, ideally `1080 × 1920`.

Fireworks on this scene are visual-only and have no audio.

### Scene 8 — Envelope / letter

| Resource | Exact path | Recommended format |
|---|---|---|
| Closed envelope | `assets/images/envelope-closed.png` | PNG/WebP |
| Letter paper texture | `assets/images/letter-paper.png` | PNG/WebP |

The letter supports manual scrolling while the typewriter effect is running.

### Scene 9 — Final

Reuses:
- fireworks
- balloons
- paper blasters
- theatrical curtains

## 5. Missing-resource behavior

The application does not intentionally fail the whole experience when an image/video is absent.

Missing image/video assets show a clearly labeled placeholder such as:
`[CAT VIDEO GOES HERE]`.

Programmatic celebration effects also provide a functional fallback for missing fireworks/balloon/paper-blaster resources.

## 6. Interaction sequence

1. Birthday question
2. Wrong answers trigger voice + shake and stay on the scene
3. Correct answer reveals cat video
4. Red curtains
5. Curtain opens
6. Darkness + bulb
7. Bulb → progressive light mood
8. Music prompt
9. Music starts
10. Old age burns → new age
11. ~1 minute celebration
12. Celebration replay
13. NEXT → music fades
14. 9:16 calm photo + gentle motion
15. Silent visual fireworks + continuously typing message
16. Manual NEXT
17. Envelope
18. NO shrinks / YES grows for five clicks
19. NO disappears
20. YES opens envelope
21. Letter emerges and types
22. Manual scrolling
23. NEXT
24. Grand finale
25. `Saaku malko`
26. Celebration gradually reduces
27. Curtains close
28. Slow fade
29. Complete black

## 7. Mobile testing

Test at least:
- iPhone portrait
- Android portrait
- narrow 320–360px viewport
- modern 390–430px viewport

Check:
- tap targets
- letter scrolling
- video controls
- no horizontal overflow
- 9:16 image cropping
- audio after a user gesture

## 8. Laptop/desktop testing

Test:
- Chrome
- Edge
- Safari if available

Check:
- mouse interaction
- keyboard focus
- video scaling
- letter scrollbar
- full-screen transitions

## 9. Deployment

This is a static site. Suitable hosts include any static hosting provider.

Upload the entire project folder, preserving paths.

Typical static deployment:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- any ordinary web server

Do not rename asset folders unless you also update `js/config.js`.

## 10. Creating a separate Sister 1 link

Recommended:
- Create a separate deployment/project named `sister-1-birthday`.
- Replace the Sister 1 resources and text.
- Publish the static project.
- Share the resulting deployment URL.

## 11. Important browser behavior

Audio is intentionally started only after a user click/tap because browsers commonly block autoplay with sound.

The Happy Birthday track fades out when entering the calm photo scene.

The calm scene's fireworks are silent.

## 12. Performance

The built-in celebration effects use a bounded number of short-lived DOM elements and CSS transforms. Timers, animation loops and celebration effects are cleaned up when scenes change.

The letter uses normal scrollable content instead of forced automatic scrolling.

`prefers-reduced-motion` is supported.
