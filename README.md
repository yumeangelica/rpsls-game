# Rock Paper Scissors Lizard Spock

A browser game built with vanilla JavaScript, HTML, and CSS — zero framework dependencies. Play against the computer by choosing Rock, Paper, Scissors, Lizard, or Spock.

Originally created in 2021, modernized in 2024–2026 with portfolio-synced design and cleaned up codebase.

## Features

- **Five-choice game logic** — Rock, Paper, Scissors, Lizard, Spock
- **Randomized computer opponent** with animated choice reveal
- **Live score tracking** — rounds, wins, losses, ties
- **Win celebration** — particle confetti effect on player wins
- **Result animations** — green/red/yellow flash for win/loss/tie
- **Reset with confirmation** — prevents accidental progress loss
- **Collapsible rules panel** — toggle game rules explanation
- **Keyboard & touch friendly** — accessible on all devices

## Technologies

- **Vanilla JavaScript (ES6+)** — dynamic DOM, game logic, animations
- **HTML5** — semantic markup with ARIA attributes
- **CSS3** — custom properties, Flexbox, Grid, responsive design
- **Google Fonts (Inter)** — consistent typography across portfolio
- **Zero Dependencies** — no Bootstrap, no npm packages

## Project Structure

```
├── index.html      # Main HTML document
├── styles.css      # All styles with CSS custom properties
├── app.js          # Game logic, DOM generation, animations
├── copyright.js    # Dynamic footer copyright year
├── img/            # Game choice images (webp)
├── LICENSE         # CC BY-NC-SA 4.0
└── README.md
```

## How to Play

1. Open `index.html` in any modern web browser
2. Click a choice button (Rock, Paper, Scissors, Lizard, or Spock)
3. Computer randomly selects its choice
4. Result is displayed with animation
5. Score updates automatically

## Game Rules

- Scissors cuts Paper, decapitates Lizard
- Paper covers Rock, disproves Spock
- Rock crushes Lizard, crushes Scissors
- Lizard poisons Spock, eats Paper
- Spock smashes Scissors, vaporizes Rock

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. See the [LICENSE](LICENSE) file for details.

---

**Created with love by [yumeangelica](https://yumeangelica.github.io) | 2021–2026**