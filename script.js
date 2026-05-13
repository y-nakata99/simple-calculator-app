const display = document.querySelector('#display');
const buttons = document.querySelector('.buttons');

const operators = {
  add: (left, right) => left + right,
  subtract: (left, right) => left - right,
  multiply: (left, right) => left * right,
  divide: (left, right) => {
    if (right === 0) {
      throw new Error('Cannot divide by zero');
    }
    return left / right;
  },
};

let currentValue = '0';
let storedValue = null;
let selectedOperator = null;
let shouldResetDisplay = false;
let hasError = false;

function updateDisplay(value, isError = false) {
  display.textContent = value;
  display.classList.toggle('error', isError);
}

function clearCalculator() {
  currentValue = '0';
  storedValue = null;
  selectedOperator = null;
  shouldResetDisplay = false;
  hasError = false;
  updateDisplay(currentValue);
}

function inputNumber(number) {
  if (hasError || shouldResetDisplay) {
    currentValue = number;
    shouldResetDisplay = false;
    hasError = false;
  } else if (currentValue === '0') {
    currentValue = number;
  } else {
    currentValue += number;
  }

  updateDisplay(currentValue);
}

function formatResult(result) {
  return Number.isInteger(result) ? String(result) : String(Number(result.toFixed(8)));
}

function calculate() {
  if (selectedOperator === null || storedValue === null) {
    return;
  }

  try {
    const rightValue = Number(currentValue);
    const result = operators[selectedOperator](storedValue, rightValue);
    currentValue = formatResult(result);
    storedValue = null;
    selectedOperator = null;
    shouldResetDisplay = true;
    updateDisplay(currentValue);
  } catch (error) {
    currentValue = '0';
    storedValue = null;
    selectedOperator = null;
    shouldResetDisplay = true;
    hasError = true;
    updateDisplay('Error: 0で割ることはできません', true);
  }
}

function chooseOperator(operator) {
  if (hasError) {
    return;
  }

  if (selectedOperator !== null && !shouldResetDisplay) {
    calculate();
  }

  storedValue = Number(currentValue);
  selectedOperator = operator;
  shouldResetDisplay = true;
}

buttons.addEventListener('click', (event) => {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  if (button.dataset.number !== undefined) {
    inputNumber(button.dataset.number);
    return;
  }

  if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
    return;
  }

  if (button.dataset.action === 'equals') {
    calculate();
    return;
  }

  if (button.dataset.action === 'clear') {
    clearCalculator();
  }
});
