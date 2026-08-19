# Rock Paper Scissors Lizard Spock

A static Vanilla JavaScript browser game based on the five-choice Rock Paper Scissors Lizard Spock rules.

Originally created in 2021 and polished in 2026 with yumeangelica's warm mauve design system, self-hosted Comfortaa, mobile-first gameplay, and race-safe round handling.

## Features

- Five player choices and a browser-generated computer choice
- Unbiased Web Crypto selection for the computer
- One active round at a time, preventing overlapping result updates
- Reset that cancels pending round callbacks before clearing the score
- Concise result explanation for every win, loss, and tie
- Semantic score table and one combined live result
- Expandable static game rules
- Short palette-matched celebration that is removed in reduced-motion mode
- System-aware light/dark theme switch with a saved user preference
- Real lossless WebP choice assets with intrinsic 160×160 dimensions

## Technology

- Semantic HTML, modern CSS, and Vanilla JavaScript
- Web Crypto API and token-scoped timers
- Self-hosted Comfortaa 400/600/700 under the SIL Open Font License
- No runtime dependencies, package manager, or build step

## Run locally

Open `index.html`, or run `python3 -m http.server 4173` and visit `http://localhost:4173`.

Choose a move, wait for the computer reveal, and follow the combined result and updated score.

## Accessibility notes

Choice buttons have visible text labels, results are announced once, score cells are not separate live regions, status is never communicated by color alone, and all images have explicit dimensions. The UI targets WCAG 2.2 AA practices, but complete conformance still requires assistive-technology and device testing.

## Project structure

```text
index.html       Static game board, score, rules, and reset dialog
styles.css       Palette A tokens and mobile-first styles
app.js           Round state, scoring, cancellation, and reveal behavior
theme.js         Early theme setup, switch state, and saved preference
copyright.js     Current footer year
img/             Local lossless WebP choice art
fonts/           Local Comfortaa files and OFL license
```

## License

Application code and content are licensed under [CC BY-NC-SA 4.0](LICENSE). Comfortaa remains under the SIL Open Font License in `fonts/OFL.txt`.

---

Created with love by [yumeangelica](https://yumeangelica.github.io) · 2021–2026
