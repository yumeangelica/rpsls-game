(() => {
  'use strict';

  /** @typedef {'rock' | 'paper' | 'scissors' | 'lizard' | 'spock'} Choice */
  /** @typedef {'win' | 'loss' | 'tie'} RoundOutcome */
  /** @typedef {{ winner: Choice, loser: Choice, action: string }} Rule */
  /** @typedef {{ outcome: RoundOutcome, message: string }} RoundResult */

  /** @type {readonly Choice[]} */
  const CHOICES = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  /** @type {readonly Rule[]} */
  const RULES = [
    { winner: 'scissors', loser: 'paper', action: 'cuts' },
    { winner: 'paper', loser: 'rock', action: 'covers' },
    { winner: 'rock', loser: 'lizard', action: 'crushes' },
    { winner: 'lizard', loser: 'spock', action: 'poisons' },
    { winner: 'spock', loser: 'scissors', action: 'smashes' },
    { winner: 'scissors', loser: 'lizard', action: 'decapitates' },
    { winner: 'lizard', loser: 'paper', action: 'eats' },
    { winner: 'paper', loser: 'spock', action: 'disproves' },
    { winner: 'spock', loser: 'rock', action: 'vaporizes' },
    { winner: 'rock', loser: 'scissors', action: 'crushes' },
  ];
  const UINT32_RANGE = 0x1_0000_0000;
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** @param {string} value */
  const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

  const elements = {
    choices: /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll('[data-choice]')]),
    computerImage: /** @type {HTMLImageElement} */ (document.getElementById('computer-image')),
    computerPlaceholder: /** @type {HTMLSpanElement} */ (document.getElementById('computer-placeholder')),
    computerLabel: /** @type {HTMLParagraphElement} */ (document.getElementById('computer-label')),
    result: /** @type {HTMLOutputElement} */ (document.getElementById('game-result')),
    rounds: /** @type {HTMLElement} */ (document.getElementById('rounds-count')),
    playerWins: /** @type {HTMLElement} */ (document.getElementById('player-wins-count')),
    computerWins: /** @type {HTMLElement} */ (document.getElementById('computer-wins-count')),
    ties: /** @type {HTMLElement} */ (document.getElementById('ties-count')),
    rulesToggle: /** @type {HTMLButtonElement} */ (document.getElementById('rules-toggle')),
    rules: /** @type {HTMLElement} */ (document.getElementById('game-rules')),
    resetButton: /** @type {HTMLButtonElement} */ (document.getElementById('reset-button')),
    resetDialog: /** @type {HTMLDialogElement} */ (document.getElementById('reset-dialog')),
    celebration: /** @type {HTMLDivElement} */ (document.getElementById('celebration')),
  };

  /**
   * @type {{
   *   rounds: number,
   *   playerWins: number,
   *   computerWins: number,
   *   ties: number,
   *   locked: boolean,
   *   roundToken: number,
   *   timeouts: Set<number>,
   *   celebrationTimeout: number | null
   * }}
   */
  const state = {
    rounds: 0,
    playerWins: 0,
    computerWins: 0,
    ties: 0,
    locked: false,
    roundToken: 0,
    timeouts: new Set(),
    celebrationTimeout: null,
  };

  /** @param {number} length */
  const randomIndex = (length) => {
    const limit = Math.floor(UINT32_RANGE / length) * length;
    const values = new Uint32Array(1);
    /** @type {number} */
    let value;
    do {
      crypto.getRandomValues(values);
      [value] = values;
    } while (value >= limit);
    return value % length;
  };

  /** @param {boolean} disabled */
  const setChoicesDisabled = (disabled) => {
    elements.choices.forEach((button) => {
      button.disabled = disabled;
    });
  };

  /** @param {Choice | null} selectedChoice */
  const setSelectedChoice = (selectedChoice) => {
    elements.choices.forEach((button) => {
      const isSelected = button.dataset.choice === selectedChoice;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  };

  const updateScore = () => {
    elements.rounds.textContent = String(state.rounds);
    elements.playerWins.textContent = String(state.playerWins);
    elements.computerWins.textContent = String(state.computerWins);
    elements.ties.textContent = String(state.ties);
  };

  /**
   * @param {string} message
   * @param {RoundOutcome | ''} [outcome]
   */
  const setResult = (message, outcome = '') => {
    /** @type {Readonly<Record<RoundOutcome, string>>} */
    const icons = { win: '✓', loss: '×', tie: '=' };
    elements.result.replaceChildren();
    const iconText = outcome ? icons[outcome] : '';
    if (iconText) {
      const icon = document.createElement('span');
      icon.className = 'result-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = iconText;
      elements.result.append(icon);
    }
    elements.result.append(document.createTextNode(message));
    if (outcome) {
      elements.result.dataset.outcome = outcome;
    } else {
      delete elements.result.dataset.outcome;
    }
  };

  /**
   * @param {() => void} callback
   * @param {number} delay
   * @param {number} token
   */
  const scheduleForRound = (callback, delay, token) => {
    const timeout = window.setTimeout(() => {
      state.timeouts.delete(timeout);
      if (token === state.roundToken) callback();
    }, delay);
    state.timeouts.add(timeout);
  };

  const clearScheduledRounds = () => {
    state.roundToken += 1;
    state.timeouts.forEach((timeout) => window.clearTimeout(timeout));
    state.timeouts.clear();
    state.locked = false;
    setChoicesDisabled(false);
  };

  const showCelebration = () => {
    if (prefersReducedMotion()) return;
    window.clearTimeout(/** @type {number} */ (state.celebrationTimeout));
    elements.celebration.hidden = false;
    elements.celebration.classList.remove('is-active');
    void elements.celebration.offsetWidth;
    elements.celebration.classList.add('is-active');
    state.celebrationTimeout = window.setTimeout(() => {
      elements.celebration.classList.remove('is-active');
      elements.celebration.hidden = true;
    }, 350);
  };

  /**
   * @param {Choice} playerChoice
   * @param {Choice} computerChoice
   * @returns {RoundResult}
   */
  const describeRound = (playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) {
      state.ties += 1;
      return {
        outcome: 'tie',
        message: `Tie — you both chose ${capitalize(playerChoice)}.`,
      };
    }

    const playerRule = RULES.find(({ winner, loser }) => winner === playerChoice && loser === computerChoice);
    if (playerRule) {
      state.playerWins += 1;
      return {
        outcome: 'win',
        message: `You win — ${capitalize(playerChoice)} ${playerRule.action} ${capitalize(computerChoice)}.`,
      };
    }

    const computerRule = /** @type {Rule} */ (
      RULES.find(({ winner, loser }) => winner === computerChoice && loser === playerChoice)
    );
    state.computerWins += 1;
    return {
      outcome: 'loss',
      message: `Computer wins — ${capitalize(computerChoice)} ${computerRule.action} ${capitalize(playerChoice)}.`,
    };
  };

  /** @param {Choice} computerChoice */
  const revealComputerChoice = (computerChoice) => {
    elements.computerImage.classList.remove('computer-image-reveal');
    elements.computerImage.src = `./img/computer_${computerChoice}.webp`;
    elements.computerImage.alt = `Computer chose ${capitalize(computerChoice)}`;
    elements.computerImage.hidden = false;
    elements.computerPlaceholder.hidden = true;
    elements.computerLabel.textContent = `Computer chose ${capitalize(computerChoice)}`;
    void elements.computerImage.offsetWidth;
    elements.computerImage.classList.add('computer-image-reveal');
  };

  /**
   * @param {Choice} playerChoice
   * @param {HTMLButtonElement} sourceButton
   */
  const playRound = (playerChoice, sourceButton) => {
    if (state.locked) return;

    let computerChoice;
    try {
      computerChoice = CHOICES[randomIndex(CHOICES.length)];
    } catch {
      setSelectedChoice(null);
      setResult('Secure browser randomness is unavailable. Try a current browser.');
      return;
    }

    state.locked = true;
    const token = ++state.roundToken;
    const shouldRestoreFocus = document.activeElement === sourceButton;
    setSelectedChoice(playerChoice);
    setChoicesDisabled(true);
    elements.computerImage.hidden = true;
    elements.computerImage.removeAttribute('src');
    elements.computerImage.alt = '';
    elements.computerImage.classList.remove('computer-image-reveal');
    elements.computerPlaceholder.hidden = false;
    elements.computerLabel.textContent = 'Computer is choosing…';
    setResult('');

    const revealDelay = prefersReducedMotion() ? 0 : 250;
    const resultDelay = prefersReducedMotion() ? 0 : 250;

    scheduleForRound(() => {
      revealComputerChoice(computerChoice);
      scheduleForRound(() => {
        state.rounds += 1;
        const round = describeRound(playerChoice, computerChoice);
        updateScore();
        setResult(round.message, round.outcome);
        state.locked = false;
        setChoicesDisabled(false);
        if (shouldRestoreFocus && document.activeElement === document.body) sourceButton.focus();
        if (round.outcome === 'win') showCelebration();
      }, resultDelay, token);
    }, revealDelay, token);
  };

  const resetGame = () => {
    clearScheduledRounds();
    window.clearTimeout(/** @type {number} */ (state.celebrationTimeout));
    elements.celebration.classList.remove('is-active');
    elements.celebration.hidden = true;

    state.rounds = 0;
    state.playerWins = 0;
    state.computerWins = 0;
    state.ties = 0;
    setSelectedChoice(null);
    updateScore();

    elements.computerImage.hidden = true;
    elements.computerImage.removeAttribute('src');
    elements.computerImage.alt = '';
    elements.computerImage.classList.remove('computer-image-reveal');
    elements.computerPlaceholder.hidden = false;
    elements.computerLabel.textContent = 'Waiting for your move';
    setResult('Game reset. Choose a move to start.');
  };

  const requestReset = () => {
    if (state.rounds === 0 && !state.locked) {
      resetGame();
      return;
    }

    if (typeof elements.resetDialog.showModal === 'function') {
      elements.resetDialog.returnValue = 'cancel';
      elements.resetDialog.showModal();
    } else {
      resetGame();
    }
  };

  const toggleRules = () => {
    const willShow = elements.rules.hidden;
    elements.rules.hidden = !willShow;
    elements.rulesToggle.setAttribute('aria-expanded', String(willShow));
    elements.rulesToggle.textContent = willShow ? 'Hide rules' : 'Show rules';
  };

  elements.choices.forEach((button) => {
    button.addEventListener('click', () => {
      playRound(/** @type {Choice} */ (button.dataset.choice), button);
    });
  });
  elements.rulesToggle.addEventListener('click', toggleRules);
  elements.resetButton.addEventListener('click', requestReset);
  elements.resetDialog.addEventListener('close', () => {
    if (elements.resetDialog.returnValue === 'confirm') resetGame();
    window.setTimeout(() => elements.resetButton.focus(), 0);
  });

  window.addEventListener('beforeunload', () => {
    clearScheduledRounds();
    window.clearTimeout(/** @type {number} */ (state.celebrationTimeout));
  });
})();
