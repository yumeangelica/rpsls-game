/**
 * Runs when the DOM is loaded. Initializes the game structure and events.
 */
document.addEventListener('DOMContentLoaded', () => {
  showCopyRight();

  // Create dynamic content
  createGameRules();
  createStatisticsTable();
  createGameContainer();

  // Create player choice buttons dynamically
  const playerChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  const playerChoiceButtonsContainer = document.getElementById('playerChoiceButtons');

  // Loop through playerChoices and create a button for each choice
  playerChoices.forEach(choice => {
    const button = document.createElement('button');
    button.classList.add('btn', 'choice-button');
    button.value = choice;
    button.ariaLabel = `Choose ${choice.charAt(0).toUpperCase() + choice.slice(1)}`;

    const img = document.createElement('img');
    img.src = `./img/user_${choice}.webp`;
    img.alt = choice.charAt(0).toUpperCase() + choice.slice(1);

    button.appendChild(img);
    button.addEventListener('click', () => playGame(choice));

    playerChoiceButtonsContainer.appendChild(button);
  });

  // Add event listener to the reset button
  document.getElementById('resetGameBtn').addEventListener('click', resetGame);

  // Add touch feedback for mobile devices
  addTouchFeedback();

  // Create game rules and statistics table
  createGameRules();
  createStatisticsTable();

  // Initialize rules toggle functionality
  initializeRulesToggle();
});

/**
 * Game rules: who beats whom and how.
 * @type {Array<{winner: string, loser: string, action: string}>}
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

/**
 * Mapping for computer choice images.
 * @type {Object.<string, string>}
 */
const computerChoiceImages = {
  rock: 'img/computer_rock.webp',
  paper: 'img/computer_paper.webp',
  scissors: 'img/computer_scissors.webp',
  lizard: 'img/computer_lizard.webp',
  spock: 'img/computer_spock.webp',
};

/**
 * Game score counters.
 * @type {number}
 */
let computerWins = 0;
let userWins = 0;
let ties = 0;
let rounds = 0;

/**
 * Randomly selects the computer's choice.
 * @returns {string} The computer's choice
 */
const getComputerChoice = () => {
  const computerChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  const randomIndex = Math.floor(Math.random() * computerChoices.length);
  return computerChoices[randomIndex];
};

/**
 * Determines the winner from the user's and computer's choices.
 * @param {string} userChoice
 * @param {string} computerChoice
 * @returns {string} Result ('You won!', 'Computer won!', 'Tie!')
 */
const determineWinner = (userChoice, computerChoice) => {
  // Object with winning combinations, key beats values in an array
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

/**
 * Resets the game and score counters.
 */
const resetGame = () => {
  if (confirm('Are you sure you want to reset the game?')) {
    console.clear(); // Clears console at the beginning of every round
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

    // Add reset animation
    const gameContainer = document.querySelector('.main-game-container');
    gameContainer.style.animation = 'resetPulse 0.5s ease-out';
    setTimeout(() => {
      gameContainer.style.animation = '';
    }, 500);
  }
}

/**
 * Updates the score display in the DOM.
 */
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
  console.clear(); // Clears console at the beginning of every round
  rounds++;

  // Add loading state
  const gameResult = document.getElementById('gameResultDisplay');
  gameResult.textContent = 'Rolling...';
  gameResult.className = 'game-result-text';

  // Animate computer choice reveal
  setTimeout(() => {
    const computerChoice = getComputerChoice();
    const computerImage = computerChoiceImages[computerChoice];

    // Display computer's choice emoji with animation
    const computerImgElement = document.getElementById('computerChoiceImg');
    computerImgElement.src = computerImage;
    computerImgElement.style.visibility = 'visible';
    computerImgElement.classList.add('show');

    // Determine and display the winner with animation
    setTimeout(() => {
      const winner = determineWinner(userChoice, computerChoice);
      gameResult.textContent = winner;

      // Add appropriate class for styling
      if (winner === 'You won!') {
        gameResult.textContent = 'You Won!';
        gameResult.className = 'game-result-text winner';
      } else if (winner === 'Computer won!') {
        gameResult.textContent = 'Computer Won!';
        gameResult.className = 'game-result-text loser';
      } else {
        gameResult.textContent = 'It\'s a Tie!';
        gameResult.className = 'game-result-text tie';
      }

      // Update scores
      updateScoreDisplay();

      // Add celebration particles for wins
      if (winner === 'You won!') {
        createCelebrationEffect();
      }
    }, 300);
  }, 600);
};

/**
 * Creates a celebration effect for a win.
 */
const createCelebrationEffect = () => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
  const container = document.body;

  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '10px';
      particle.style.height = '10px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = '0px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      particle.style.animation = 'fall 3s linear forwards';

      container.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 3000);
    }, i * 100);
  }
};

/**
 * Adds CSS styles for the particle animation.
 */
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

/**
 * Adds touch feedback for mobile devices.
 */
const addTouchFeedback = () => {
  const buttons = document.querySelectorAll('.choice-button');
  buttons.forEach(button => {
    // scale down on touchstart and provide haptic feedback if available
    button.addEventListener('touchstart', () => {
      button.style.transform = 'scale(0.95)';
      button.style.transition = 'transform 0.1s ease';
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    });

    // scale back on touchend and touchcancel
    ['touchend', 'touchcancel'].forEach(evt => {
      button.addEventListener(evt, () => {
        button.style.transform = 'scale(1)';
        button.style.transition = 'transform 0.2s ease';
      });
    });

    // directly handle game logic on touchend
    button.addEventListener('touchend', () => {
      playGame(button.value);
    });
  });
};


/**
 * Dynamically creates the game rules view.
 */
const createGameRules = () => {
  const rulesContainer = document.querySelector('.rules-grid');
  if (!rulesContainer) return;

  rulesContainer.innerHTML = '';

  gameRules.forEach(rule => {
    const ruleItem = document.createElement('div');
    ruleItem.classList.add('rule-item');

    const ruleIcons = document.createElement('div');
    ruleIcons.classList.add('rule-icons');

    const winnerImg = document.createElement('img');
    winnerImg.src = `./img/user_${rule.winner}.webp`;
    winnerImg.alt = rule.winner.charAt(0).toUpperCase() + rule.winner.slice(1);
    winnerImg.classList.add('rule-icon');

    const arrow = document.createTextNode(' → ');

    const loserImg = document.createElement('img');
    loserImg.src = `./img/user_${rule.loser}.webp`;
    loserImg.alt = rule.loser.charAt(0).toUpperCase() + rule.loser.slice(1);
    loserImg.classList.add('rule-icon');

    ruleIcons.appendChild(winnerImg);
    ruleIcons.appendChild(arrow);
    ruleIcons.appendChild(loserImg);

    const ruleText = document.createElement('span');
    ruleText.classList.add('rule-text');
    ruleText.textContent = `${rule.winner.charAt(0).toUpperCase() + rule.winner.slice(1)} ${rule.action} ${rule.loser.charAt(0).toUpperCase() + rule.loser.slice(1)}`;

    ruleItem.appendChild(ruleIcons);
    ruleItem.appendChild(ruleText);
    rulesContainer.appendChild(ruleItem);
  });
};

/**
 * Dynamically creates the statistics table.
 */
const createStatisticsTable = () => {
  const statsContainer = document.querySelector('.game-statistics-section');
  if (!statsContainer) return;

  const statsTitle = document.createElement('h3');
  statsTitle.classList.add('statistics-title', 'text-center', 'mb-3');
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

/**
 * Dynamically creates the main game container structure.
 */
const createGameContainer = () => {
  const container = document.querySelector('.main-game-container');
  if (!container) return;

  // Create game structure if it doesn't exist
  if (!document.querySelector('.gameplay-area')) {
    const gameplayArea = document.createElement('div');
    gameplayArea.classList.add('gameplay-area');

    const gameplayTitle = document.createElement('h3');
    gameplayTitle.classList.add('gameplay-title', 'text-center', 'mb-3');
    gameplayTitle.textContent = 'Choose Your Move';

    const row = document.createElement('div');
    row.classList.add('row', 'align-items-center');

    // Player section
    const playerCol = document.createElement('div');
    playerCol.classList.add('col-md-4');
    const playerSection = document.createElement('div');
    playerSection.classList.add('player-section');
    const playerTitle = document.createElement('h4');
    playerTitle.classList.add('player-title', 'text-center', 'mb-3');
    playerTitle.innerHTML = '👤 You';
    const playerButtons = document.createElement('div');
    playerButtons.id = 'playerChoiceButtons';
    playerButtons.classList.add('choice-buttons-container');

    playerSection.appendChild(playerTitle);
    playerSection.appendChild(playerButtons);
    playerCol.appendChild(playerSection);

    // VS section
    const vsCol = document.createElement('div');
    vsCol.classList.add('col-md-4', 'text-center');
    const vsSection = document.createElement('div');
    vsSection.classList.add('vs-section');
    const vsText = document.createElement('p');
    vsText.classList.add('vs-text');
    const vsDivider = document.createElement('span');
    vsDivider.classList.add('vs-divider');
    vsDivider.textContent = '⚡ VS ⚡';
    vsText.appendChild(vsDivider);
    vsSection.appendChild(vsText);
    vsCol.appendChild(vsSection);

    // Computer section
    const computerCol = document.createElement('div');
    computerCol.classList.add('col-md-4');
    const computerSection = document.createElement('div');
    computerSection.classList.add('computer-section');
    const computerTitle = document.createElement('h4');
    computerTitle.classList.add('computer-title', 'text-center', 'mb-3');
    computerTitle.innerHTML = '🤖 Computer';
    const computerDisplay = document.createElement('div');
    computerDisplay.classList.add('text-center');
    const computerImg = document.createElement('img');
    computerImg.id = 'computerChoiceImg';
    computerImg.classList.add('computer-choice-display');
    computerImg.alt = "Computer's choice";
    computerImg.src = '';

    computerDisplay.appendChild(computerImg);
    computerSection.appendChild(computerTitle);
    computerSection.appendChild(computerDisplay);
    computerCol.appendChild(computerSection);

    row.appendChild(playerCol);
    row.appendChild(vsCol);
    row.appendChild(computerCol);

    gameplayArea.appendChild(gameplayTitle);
    gameplayArea.appendChild(row);

    // Game result section
    const gameResultSection = document.createElement('div');
    gameResultSection.classList.add('game-result-section');
    const gameResultDisplay = document.createElement('div');
    gameResultDisplay.id = 'gameResultDisplay';
    gameResultDisplay.classList.add('game-result-text');
    gameResultDisplay.setAttribute('aria-live', 'polite');
    gameResultSection.appendChild(gameResultDisplay);

    // Insert after statistics section
    const statsSection = document.querySelector('.game-statistics-section');
    statsSection.insertAdjacentElement('afterend', gameplayArea);
    gameplayArea.insertAdjacentElement('afterend', gameResultSection);
  }
};

/**
 * Initializes the rules menu toggle functionality.
 */
const initializeRulesToggle = () => {
  const rulesToggleBtn = document.querySelector('.rules-toggle-btn');
  const rulesCollapse = document.getElementById('gameRules');

  if (rulesToggleBtn && rulesCollapse) {
    console.log('Found rules elements, setting up toggle');

    rulesToggleBtn.addEventListener('click', () => {
      console.log('Rules button clicked');
      const isExpanded = rulesToggleBtn.getAttribute('aria-expanded') === 'true';

      // Manually toggle the collapse
      if (rulesCollapse.classList.contains('show')) {
        rulesCollapse.classList.remove('show');
        rulesToggleBtn.textContent = '📋 Show Game Rules';
        rulesToggleBtn.setAttribute('aria-expanded', 'false');
        console.log('Hiding rules');
      } else {
        rulesCollapse.classList.add('show');
        rulesToggleBtn.textContent = '📋 Hide Game Rules';
        rulesToggleBtn.setAttribute('aria-expanded', 'true');
        console.log('Showing rules');
      }
    });
  } else {
    console.log('Rules elements not found');
  }
};
