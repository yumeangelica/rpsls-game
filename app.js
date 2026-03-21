/**
 * RPSLS Game — 2026 Modernized
 * Vanilla JS, no frameworks
 */

document.addEventListener('DOMContentLoaded', () => {
  showCopyRight();
  createGameRules();
  createStatisticsTable();
  createGameContainer();

  // Create player choice buttons
  const playerChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  const playerChoiceButtonsContainer = document.getElementById('playerChoiceButtons');

  playerChoices.forEach(choice => {
    const button = document.createElement('button');
    button.classList.add('choice-button');
    button.value = choice;
    button.ariaLabel = `Choose ${choice.charAt(0).toUpperCase() + choice.slice(1)}`;

    const img = document.createElement('img');
    img.src = `./img/user_${choice}.webp`;
    img.alt = choice.charAt(0).toUpperCase() + choice.slice(1);

    button.appendChild(img);
    button.addEventListener('click', () => playGame(choice));
    playerChoiceButtonsContainer.appendChild(button);
  });

  document.getElementById('resetGameBtn').addEventListener('click', resetGame);
  initializeRulesToggle();
});

/**
 * Game rules: who beats whom and how.
 */
const gameRules = [
  { winner: 'scissors', loser: 'paper', action: 'cuts' },
  { winner: 'paper', loser: 'rock', action: 'covers' },
  { winner: 'rock', loser: 'lizard', action: 'crushes' },
  { winner: 'lizard', loser: 'spock', action: 'poisons' },
  { winner: 'spock', loser: 'scissors', action: 'smashes' },
  { winner: 'scissors', loser: 'lizard', action: 'decapitates' },
  { winner: 'lizard', loser: 'paper', action: 'eats' },
  { winner: 'paper', loser: 'spock', action: 'disproves' },
  { winner: 'spock', loser: 'rock', action: 'vaporizes' },
  { winner: 'rock', loser: 'scissors', action: 'crushes' }
];

/** Computer choice image paths */
const computerChoiceImages = {
  rock: 'img/computer_rock.webp',
  paper: 'img/computer_paper.webp',
  scissors: 'img/computer_scissors.webp',
  lizard: 'img/computer_lizard.webp',
  spock: 'img/computer_spock.webp',
};

/** Game score counters */
let computerWins = 0;
let userWins = 0;
let ties = 0;
let rounds = 0;

/** Randomly selects the computer's choice */
const getComputerChoice = () => {
  const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  return choices[Math.floor(Math.random() * choices.length)];
};

/**
 * Determines the winner from user and computer choices.
 * @returns {string} Result message
 */
const determineWinner = (userChoice, computerChoice) => {
  const winningCombos = {
    scissors: ['paper', 'lizard'],
    paper: ['rock', 'spock'],
    rock: ['lizard', 'scissors'],
    lizard: ['spock', 'paper'],
    spock: ['scissors', 'rock']
  };

  if (userChoice === computerChoice) {
    ties++;
    return 'Tie!';
  }

  if (winningCombos[userChoice].includes(computerChoice)) {
    userWins++;
    return 'You won!';
  } else {
    computerWins++;
    return 'Computer won!';
  }
};

/** Resets the game and score counters */
const resetGame = () => {
  if (rounds === 0) return;
  if (!confirm('Are you sure you want to reset the game?')) return;

  rounds = 0;
  computerWins = 0;
  userWins = 0;
  ties = 0;

  updateScoreDisplay();

  const gameResult = document.getElementById('gameResultDisplay');
  gameResult.textContent = '';
  gameResult.className = 'game-result-text';

  const computerImg = document.getElementById('computerChoiceImg');
  computerImg.style.visibility = 'hidden';
  computerImg.classList.remove('show');
};

/** Updates the score display */
const updateScoreDisplay = () => {
  document.getElementById('roundsCount').textContent = rounds;
  document.getElementById('playerWinsCount').textContent = userWins;
  document.getElementById('computerWinsCount').textContent = computerWins;
  document.getElementById('tiesCount').textContent = ties;
};

/**
 * Plays a single round of the game.
 * @param {string} userChoice
 */
const playGame = (userChoice) => {
  rounds++;

  const gameResult = document.getElementById('gameResultDisplay');
  gameResult.textContent = 'Rolling...';
  gameResult.className = 'game-result-text';

  setTimeout(() => {
    const computerChoice = getComputerChoice();

    const computerImgElement = document.getElementById('computerChoiceImg');
    computerImgElement.src = computerChoiceImages[computerChoice];
    computerImgElement.style.visibility = 'visible';
    computerImgElement.classList.add('show');

    setTimeout(() => {
      const winner = determineWinner(userChoice, computerChoice);

      if (winner === 'You won!') {
        gameResult.textContent = 'You Won!';
        gameResult.className = 'game-result-text winner';
        createCelebrationEffect();
      } else if (winner === 'Computer won!') {
        gameResult.textContent = 'Computer Won!';
        gameResult.className = 'game-result-text loser';
      } else {
        gameResult.textContent = "It's a Tie!";
        gameResult.className = 'game-result-text tie';
      }

      updateScoreDisplay();
    }, 300);
  }, 600);
};

/** Creates celebration particle effect */
const createCelebrationEffect = () => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];

  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        left: ${Math.random() * window.innerWidth}px;
        top: 0;
        pointer-events: none;
        z-index: 9999;
        animation: fall 3s linear forwards;
      `;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 3000);
    }, i * 100);
  }
};

/** CSS for particle fall animation */
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    to {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

/** Dynamically creates the game rules view */
const createGameRules = () => {
  const rulesContainer = document.querySelector('.rules-grid');
  if (!rulesContainer) return;
  rulesContainer.innerHTML = '';

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  gameRules.forEach(rule => {
    const ruleItem = document.createElement('div');
    ruleItem.classList.add('rule-item');

    const ruleIcons = document.createElement('div');
    ruleIcons.classList.add('rule-icons');

    const winnerImg = document.createElement('img');
    winnerImg.src = `./img/user_${rule.winner}.webp`;
    winnerImg.alt = capitalize(rule.winner);
    winnerImg.classList.add('rule-icon');

    const loserImg = document.createElement('img');
    loserImg.src = `./img/user_${rule.loser}.webp`;
    loserImg.alt = capitalize(rule.loser);
    loserImg.classList.add('rule-icon');

    ruleIcons.appendChild(winnerImg);
    ruleIcons.appendChild(document.createTextNode(' → '));
    ruleIcons.appendChild(loserImg);

    const ruleText = document.createElement('span');
    ruleText.classList.add('rule-text');
    ruleText.textContent = `${capitalize(rule.winner)} ${rule.action} ${capitalize(rule.loser)}`;

    ruleItem.appendChild(ruleIcons);
    ruleItem.appendChild(ruleText);
    rulesContainer.appendChild(ruleItem);
  });
};

/** Dynamically creates the statistics table */
const createStatisticsTable = () => {
  const statsContainer = document.querySelector('.game-statistics-section');
  if (!statsContainer) return;

  const statsTitle = document.createElement('h3');
  statsTitle.classList.add('statistics-title');
  statsTitle.textContent = 'Game Statistics';

  const table = document.createElement('table');
  table.classList.add('statistics-table');

  const statistics = [
    { label: 'Rounds Played:', id: 'roundsCount' },
    { label: 'Your Wins:', id: 'playerWinsCount' },
    { label: 'Computer Wins:', id: 'computerWinsCount' },
    { label: 'Ties:', id: 'tiesCount' }
  ];

  statistics.forEach(stat => {
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    labelCell.textContent = stat.label;
    const valueCell = document.createElement('td');
    valueCell.id = stat.id;
    valueCell.setAttribute('aria-live', 'polite');
    valueCell.textContent = '0';
    row.appendChild(labelCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  });

  statsContainer.innerHTML = '';
  statsContainer.appendChild(statsTitle);
  statsContainer.appendChild(table);
};

/** Dynamically creates the main game layout */
const createGameContainer = () => {
  const container = document.querySelector('.main-game-container');
  if (!container || document.querySelector('.gameplay-area')) return;

  const gameplayArea = document.createElement('div');
  gameplayArea.classList.add('gameplay-area');

  const gameplayTitle = document.createElement('h3');
  gameplayTitle.classList.add('gameplay-title');
  gameplayTitle.textContent = 'Choose Your Move';

  const layout = document.createElement('div');
  layout.classList.add('game-layout');

  // Player section
  const playerSection = document.createElement('div');
  playerSection.classList.add('player-section');
  const playerTitle = document.createElement('h4');
  playerTitle.classList.add('player-title');
  playerTitle.textContent = '👤 You';
  const playerButtons = document.createElement('div');
  playerButtons.id = 'playerChoiceButtons';
  playerButtons.classList.add('choice-buttons-container');
  playerSection.appendChild(playerTitle);
  playerSection.appendChild(playerButtons);

  // VS section
  const vsSection = document.createElement('div');
  vsSection.classList.add('vs-section');
  const vsText = document.createElement('p');
  vsText.classList.add('vs-text');
  vsText.textContent = '⚡ VS ⚡';
  vsSection.appendChild(vsText);

  // Computer section
  const computerSection = document.createElement('div');
  computerSection.classList.add('computer-section');
  const computerTitle = document.createElement('h4');
  computerTitle.classList.add('computer-title');
  computerTitle.textContent = '🤖 Computer';
  const computerImg = document.createElement('img');
  computerImg.id = 'computerChoiceImg';
  computerImg.classList.add('computer-choice-display');
  computerImg.alt = "Computer's choice";
  computerImg.src = '';
  computerSection.appendChild(computerTitle);
  computerSection.appendChild(computerImg);

  layout.appendChild(playerSection);
  layout.appendChild(vsSection);
  layout.appendChild(computerSection);

  gameplayArea.appendChild(gameplayTitle);
  gameplayArea.appendChild(layout);

  // Game result section
  const gameResultSection = document.createElement('div');
  gameResultSection.classList.add('game-result-section');
  const gameResultDisplay = document.createElement('div');
  gameResultDisplay.id = 'gameResultDisplay';
  gameResultDisplay.classList.add('game-result-text');
  gameResultDisplay.setAttribute('aria-live', 'polite');
  gameResultSection.appendChild(gameResultDisplay);

  const statsSection = document.querySelector('.game-statistics-section');
  statsSection.insertAdjacentElement('afterend', gameplayArea);
  gameplayArea.insertAdjacentElement('afterend', gameResultSection);
};

/** Initializes rules toggle */
const initializeRulesToggle = () => {
  const rulesToggleBtn = document.querySelector('.rules-toggle-btn');
  const rulesCollapse = document.getElementById('gameRules');
  if (!rulesToggleBtn || !rulesCollapse) return;

  rulesToggleBtn.addEventListener('click', () => {
    if (rulesCollapse.classList.contains('show')) {
      rulesCollapse.classList.remove('show');
      rulesToggleBtn.textContent = '📋 Show Game Rules';
      rulesToggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      rulesCollapse.classList.add('show');
      rulesToggleBtn.textContent = '📋 Hide Game Rules';
      rulesToggleBtn.setAttribute('aria-expanded', 'true');
    }
  });
};