// Wait for the DOM to fully load before running the showCopyRight function
document.addEventListener('DOMContentLoaded', () => {
  showCopyRight();

  // Create user choice buttons dynamically
  const userChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  const userChoiceButtonsContainer = document.getElementById('userChoiceButtonsContainer');

  // Loop through userChoices and create a button for each choice
  userChoices.forEach(choice => {
    const button = document.createElement('button');
    button.classList.add('btn', 'user-choice-button');
    button.value = choice;
    button.ariaLabel = `Choose ${choice.charAt(0).toUpperCase() + choice.slice(1)}`;

    const img = document.createElement('img');
    img.src = `./img/user_${choice}.webp`;
    img.alt = choice.charAt(0).toUpperCase() + choice.slice(1);

    button.appendChild(img);
    button.addEventListener('click', () => playGame(choice));

    userChoiceButtonsContainer.appendChild(button);
  });

  // Add event listener to the reset button
  document.getElementById('resetButton').addEventListener('click', resetGame);
});

// Storing images to variables for computer emojis
const computerEmojiImages = {
  rock: 'img/computer_rock.webp',
  paper: 'img/computer_paper.webp',
  scissors: 'img/computer_scissors.webp',
  lizard: 'img/computer_lizard.webp',
  spock: 'img/computer_spock.webp',
};

// Variables to keep track of scores
let computerWins = 0;
let userWins = 0;
let ties = 0;
let rounds = 0;

// Function to calculate the computer's choice randomly
const getComputerChoice = () => {
  const computerChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  const randomIndex = Math.floor(Math.random() * computerChoices.length);
  return computerChoices[randomIndex];
};

// Function to determine the winner based on the choices
/*
"Scissors cuts paper,
paper covers rock,
rock crushes lizard,
lizard poisons Spock,
Spock smashes scissors,
scissors decapitates lizard,
lizard eats paper,
paper disproves Spock,
Spock vaporizes rock,
rock crushes scissors."
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

// Function to reset the game and clear scores
const resetGame = () => {
  if (confirm('Are you sure you want to reset the game?')) {
    console.clear(); // Clears console at the beginning of every round
    rounds = 0;
    computerWins = 0;
    userWins = 0;
    ties = 0;

    updateScoreDisplay();
    document.getElementById('gameResult').textContent = '';
    document.getElementById('computerEmoji').style.visibility = 'hidden';
  }
}

// Function to update the score display in the DOM
const updateScoreDisplay = () => {
  document.getElementById('roundsDisplay').textContent = rounds;
  document.getElementById('userWinsDisplay').textContent = userWins;
  document.getElementById('computerWinsDisplay').textContent = computerWins;
  document.getElementById('tiesDisplay').textContent = ties;
};

// Main function to handle the game logic
const playGame = (userChoice) => {
  console.clear(); // Clears console at the beginning of every round
  rounds++;

  const computerChoice = getComputerChoice();
  const computerImage = computerEmojiImages[computerChoice];

  // Display computer's choice emoji
  const computerImgElement = document.getElementById('computerEmoji');
  computerImgElement.src = computerImage;
  computerImgElement.style.visibility = 'visible'; // Make the image visible

  // Determine and display the winner
  const winner = determineWinner(userChoice, computerChoice);
  document.getElementById('gameResult').textContent = winner;

  // Update scores
  updateScoreDisplay();
};
