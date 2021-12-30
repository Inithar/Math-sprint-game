let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

let correctEquations;
let wrongEquations;
let minNumber;
let maxNumber;
let equationValue;

// Get random number up to a certain amount
const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Set appropriate logic based on math operation and difficulty
const setEquationsLogic = () => {
	// Randomly choose how many correct equations there should be
	correctEquations = getRandomInt(1, questionAmount);
	// Set amount of wrong equations
	wrongEquations = questionAmount - correctEquations;

	switch (selectedMathOperation) {
		case 'addition':
			setBigLimitNumbers(selectedDifficulty);
			createEquations('+');
			break;
		case 'subtraction':
			setBigLimitNumbers(selectedDifficulty);
			createEquations('-');
			break;
		case 'multiplication':
			setSmallLimitNumbers(selectedDifficulty);
			createEquations('*');
			break;
		case 'division':
			setSmallLimitNumbers(selectedDifficulty);
			createEquations('/');
			break;
	}

	shuffle(equationsArray);
};

// Set small numbers depending on the difficulty level
const setSmallLimitNumbers = (selectedDifficulty) => {
	minNumber = 1;
	switch (selectedDifficulty) {
		case 'normal':
			maxNumber = 10;
			break;
		case 'hard':
			maxNumber = 100;
			break;
		case 'veryHard':
			maxNumber = 1000;
			break;
	}
};

// Set big numbers depending on the difficulty level
const setBigLimitNumbers = (selectedDifficulty) => {
	switch (selectedDifficulty) {
		case 'normal':
			minNumber = 1;
			maxNumber = 100;
			break;
		case 'hard':
			minNumber = 100;
			maxNumber = 1000;
			break;
		case 'veryHard':
			minNumber = 1000;
			maxNumber = 10000;
			break;
	}
};

// Draw two random numbers
const getRandomNumbers = (min, max, division) => {
	if (division) {
		do {
			firstNumber = getRandomInt(min, max);
			secondNumber = getRandomInt(min, max);
		} while (firstNumber % secondNumber !== 0);
	} else {
		do {
			firstNumber = getRandomInt(min, max);
			secondNumber = getRandomInt(min, max);
		} while (firstNumber < secondNumber);
	}
};

// Add corect equations to object and array
const addCorectEquations = (operation) => {
	const equation = `${firstNumber} ${operation} ${secondNumber} = ${equationValue}`;
	equationObject = { value: equation, evaluated: 'true' };
	equationsArray.push(equationObject);
};

// Add incorect equations to object and array
const addIncorectEquations = (operation) => {
	wrongFormat[0] = `${firstNumber} ${operation} ${secondNumber + 2} = ${equationValue}`;
	wrongFormat[1] = `${firstNumber} ${operation} ${secondNumber} = ${equationValue + 1}`;
	wrongFormat[2] = `${firstNumber + 1} ${operation} ${secondNumber} = ${equationValue}`;
	const formatChoice = getRandomInt(1, 2);
	const equation = wrongFormat[formatChoice];
	equationObject = { value: equation, evaluated: 'false' };
	equationsArray.push(equationObject);
};

// Sets appropriate math operator
const equationMathOperation = (operation, corect) => {
	getRandomNumbers(minNumber, maxNumber, false);
	switch (operation) {
		case '+':
			equationValue = firstNumber + secondNumber;
			corect ? addCorectEquations('+') : addIncorectEquations('+');
			break;
		case '-':
			equationValue = firstNumber - secondNumber;
			corect ? addCorectEquations('-') : addIncorectEquations('-');
			break;
		case '*':
			equationValue = firstNumber * secondNumber;
			corect ? addCorectEquations('x') : addIncorectEquations('x');
			break;
		case '/':
			getRandomNumbers(minNumber, maxNumber, true);
			equationValue = firstNumber / secondNumber;
			corect ? addCorectEquations(':') : addIncorectEquations(':');
			break;
	}
};

const createEquations = (operation) => {
	for (let i = 0; i < correctEquations; i++) {
		equationMathOperation(operation, true);
	}

	for (let i = 0; i < wrongEquations; i++) {
		equationMathOperation(operation, false);
	}
};
