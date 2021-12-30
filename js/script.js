// Pages
const questionPage = document.querySelector('.question-page');
const countdownPage = document.querySelector('.countdown-page');
const gamePage = document.querySelector('.game-page');
const scorePage = document.querySelector('.score-page');

// Number of questions page
const questionForm = document.querySelector('.question-form');
const radioQuestionContainers = document.querySelectorAll('.radio-container');
const radioQuestionsInputs = document.querySelectorAll('.radio-container__input');

// Countdown Page
const countdown = document.querySelector('.countdown');

// Game Page
const itemContainer = document.querySelector('.item-container');

// Score Page
const finalTime = document.querySelector('.score-container__final-time');
const baseTime = document.querySelector('.score-container__base-time');
const penaltyTime = document.querySelector('.score-container__penalty-time');
const playAgainBtn = document.querySelector('.play-again-btn');

// Settings
const settings = document.querySelector('.settings');
const settingOpenIcon = document.querySelector('.settings-open-icon');
const settingCloseIcon = document.querySelector('.settings-close-icon');

const radioColorContainers = document.querySelectorAll('.form-box__color-radio');
const radioDifficultyContainers = document.querySelectorAll('.form-box__difficulty-radio');
const radioMathOperationContainers = document.querySelectorAll('.form-box__math-operation-radio');

const colorsForm = document.querySelector('.colors-form');
const difficultyForm = document.querySelector('.difficulty-form');
const mathOperationForm = document.querySelector('.math-operation-form');

const radioColorInputs = document.querySelectorAll('.form-box__color-input');
const radioDifficultyInputs = document.querySelectorAll('.form-box__difficulty-input');
const radioMathOperationInputs = document.querySelectorAll('.form-box__math-operation-input');

const gameContainer = document.querySelector('.game-container');
const settingsBtn = document.querySelector('.settings-btn');
let root = document.documentElement;

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];

// Scroll
let valueY = 0;

// Timer
let timer;
let timePlayed = 0;
let baseTimeValue = 0;
let penaltyTimeValue = 0;
let finalTimeValue = 0;
let finalTimeDisplay = '0.0';

// Settings
let selectedColor;
let selectedDifficulty;
let selectedMathOperation;

// Get the value from selected radio button
const getRadioValue = (inputs) => {
	let radioValue;
	inputs.forEach((radioInput) => {
		if (radioInput.checked) {
			radioValue = radioInput.value;
		}
	});
	return radioValue;
};

// Toggle selected input
const toggleSelectedInput = (radioContainers) => {
	radioContainers.forEach((radioEl) => {
		// Remove styling
		radioEl.classList.remove('selected-label');
		// Add it back if radio input is checked
		if (radioEl.children[1].checked) {
			radioEl.classList.add('selected-label');
		}
	});
};

// Sets colors in root
const setColors = (secondColor, selectedColor, hoverColor) => {
	root.style.setProperty('--second-color', secondColor);
	root.style.setProperty('--selected-color', selectedColor);
	root.style.setProperty('--hover-color', hoverColor);
};

const changeColors = (selectedColor) => {
	switch (selectedColor) {
		case 'color1':
			setColors('rgb(0, 173, 181)', 'rgba(0, 173, 181, 0.4)', 'rgb(5, 209, 219)');
			break;
		case 'color2':
			setColors('rgb(191, 162, 219)', 'rgba(191, 162, 219, 0.4)', 'rgb(218, 187, 247)');
			break;
		case 'color3':
			setColors('rgb(255, 169, 49)', 'rgba(255, 169, 49, 0.6)', 'rgb(253 158 25)');
			break;
	}
};

// Reset game
const playAgain = () => {
	gamePage.addEventListener('click', startTimer);
	scorePage.hidden = true;
	questionPage.hidden = false;
	equationsArray = [];
	playerGuessArray = [];
	valueY = 0;
	playAgainBtn.hidden = true;
	settingOpenIcon.classList.remove('display-none');
};

// Show Score Page
const showScorePage = () => {
	// Show Play Again button after 1 second delay
	setTimeout(() => {
		playAgainBtn.hidden = false;
	}, 500);
	gamePage.hidden = true;
	scorePage.hidden = false;
};

// Display time in DOM
const scoresToDOM = () => {
	finalTimeDisplay = finalTimeValue.toFixed(1);
	baseTimeValue = timePlayed.toFixed(1);
	penaltyTimeValue = penaltyTimeValue.toFixed(1);
	baseTime.textContent = `Base Time: ${baseTimeValue}s`;
	penaltyTime.textContent = `Penalty: +${penaltyTimeValue}s`;
	finalTime.textContent = `${finalTimeDisplay}s`;
	// Scroll to Top, go to Score Page
	itemContainer.scrollTo({ top: 0, behavior: 'instant' });
	showScorePage();
};

// Stop timer, process results, go to score page
const checkTime = () => {
	if (playerGuessArray.length == questionAmount) {
		clearInterval(timer);
		// Check for wrong guess and add penaltyTime
		equationsArray.forEach((equation, index) => {
			if (equation.evaluated !== playerGuessArray[index]) {
				penaltyTimeValue += 30;
			}
		});
		finalTimeValue = timePlayed + penaltyTimeValue;
		scoresToDOM();
	}
};

// Add a tenth of a second
const addTime = () => {
	timePlayed += 0.1;
	checkTime();
};

// Start timer when game page is clicked
const startTimer = () => {
	// Reset times
	timePlayed = 0;
	penaltyTimeValue = 0;
	finalTimeValue = 0;

	timer = setInterval(addTime, 100);
	gamePage.removeEventListener('click', startTimer);
};

// Scroll equations and store user selection
const select = (guessedTrue) => {
	const height = gameContainer.offsetHeight;
	console.log(height);
	// Scroll 60 or 80 more pixels
	height === 650 ? (valueY += 60) : (valueY += 80);

	itemContainer.scroll(0, valueY);
	// Add player guess to array
	return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
};

// Displays Game Page
const showGamePage = () => {
	gamePage.hidden = false;
	countdownPage.hidden = true;
};

// Add Equations to DOM
const equationsToDOM = () => {
	equationsArray.forEach((equation) => {
		// Item
		const item = document.createElement('div');
		item.classList.add('item');
		// Equation Text
		const equationText = document.createElement('h2');
		equationText.classList.add('item__equation');
		equationText.textContent = equation.value;
		// Append
		item.append(equationText);
		itemContainer.append(item);
	});
};

// Dynamically adding correct/incorrect equations
const createGamePage = () => {
	// Reset DOM
	itemContainer.textContent = '';
	// Top gap
	const topGap = document.createElement('div');
	topGap.classList.add('height-240');
	// Selected Item
	const selectedItem = document.createElement('div');
	selectedItem.classList.add('selected-item');
	// Append
	itemContainer.append(topGap, selectedItem);

	// Create Equations, Build Elements in DOM
	setEquationsLogic();
	equationsToDOM();

	// Bottom gap
	const bottomGap = document.createElement('div');
	bottomGap.classList.add('height-500');
	itemContainer.append(bottomGap);
};

// Counts down and displays from 3 to GO
const countdownStart = () => {
	let count = 3;
	countdown.textContent = count;
	const timeCountDown = setInterval(() => {
		count--;
		if (count === 0) {
			countdown.textContent = 'GO!';
		} else if (count === -1) {
			showGamePage();
			clearInterval(timeCountDown);
		} else {
			countdown.textContent = count;
		}
	}, 1000);
};

// Navigate from Question Page to Countdown Page to Game Page
const showCountdown = () => {
	countdownPage.hidden = false;
	questionPage.hidden = true;
	countdownStart();
	createGamePage();
};

// Sets and submit form settings
const setSettings = () => {
	// Sets color
	selectedColor = getRadioValue(radioColorInputs);
	// Sets difficulty
	selectedDifficulty = getRadioValue(radioDifficultyInputs);
	// Sets math operation
	selectedMathOperation = getRadioValue(radioMathOperationInputs);

	// change colors
	changeColors(selectedColor);
	settings.classList.remove('display');
};

// Sets the number of questions
const setNumberQuestions = (e) => {
	e.preventDefault();
	questionAmount = getRadioValue(radioQuestionsInputs);
	if (questionAmount) {
		settingOpenIcon.classList.add('display-none');
		showCountdown();
	}
};

//Event Listeners
gamePage.addEventListener('click', startTimer);
questionForm.addEventListener('submit', setNumberQuestions);
settingsBtn.addEventListener('click', setSettings);
playAgainBtn.addEventListener('click', playAgain);
settingOpenIcon.addEventListener('click', () => {
	settings.classList.add('display');
});
settingCloseIcon.addEventListener('click', () => {
	settings.classList.remove('display');
});

// On load
setSettings();
