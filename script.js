//GET HTML ELEMENTS


const buttons = document.querySelectorAll(".button button");

const calculation = document.getElementById("calculater");
const answer = document.getElementById("answer");

const themeToggle = document.getElementById("themeToggle");


//  CALCULATOR VARIABLES

let currentValue = "0";
let previousValue = null;
let operator = null;
let waitingForNewValue = false;



// UPDATE DISPLAY


function updateDisplay() {
    answer.textContent = currentValue;
}



//  NUMBER INPUT


function inputNumber(number) {

    if (waitingForNewValue) {
        currentValue = number;
        waitingForNewValue = false;
    } else {
        currentValue =
            currentValue === "0"
                ? number
                : currentValue + number;
    }

    updateDisplay();
}

// DECIMAL INPUT

function inputDecimal() {

    if (waitingForNewValue) {
        currentValue = "0.";
        waitingForNewValue = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}


// CALCULATIONS


function calculate() {

    if (operator === null || previousValue === null) {
        return;
    }

    const first = previousValue;
    const second = parseFloat(currentValue);

    let result;

    switch (operator) {

        case "+":
            result = first + second;
            break;

        case "-":
            result = first - second;
            break;

        case "×":
            result = first * second;
            break;

        case "÷":
            if (second === 0) {
                currentValue = "Cannot divide by zero";
                updateDisplay();
                resetCalculator();
                return;
            }

            result = first / second;
            break;
    }

    currentValue = String(
        Number(result.toPrecision(12))
    );

    previousValue = null;
    operator = null;
    waitingForNewValue = true;

    calculation.textContent = "";

    updateDisplay();
}



// SELECT OPERATOR


function selectOperator(selectedOperator) {

    const value = parseFloat(currentValue);

    if (operator && !waitingForNewValue) {
        calculate();
    }

    previousValue = parseFloat(currentValue);
    operator = selectedOperator;

    calculation.textContent =
        previousValue + " " + operator;

    waitingForNewValue = true;
}


// CLEAR FUNCTIONS


function clearAll() {

    currentValue = "0";
    previousValue = null;
    operator = null;
    waitingForNewValue = false;

    calculation.textContent = "";

    updateDisplay();
}

function clearEntry() {

    currentValue = "0";

    updateDisplay();
}


//  BACKSPACE

function backspace() {

    if (waitingForNewValue) {
        return;
    }

    currentValue =
        currentValue.length > 1
            ? currentValue.slice(0, -1)
            : "0";

    if (currentValue === "-") {
        currentValue = "0";
    }

    updateDisplay();
}



//  SPECIAL OPERATIONS


function specialOperation(value) {

    const number = parseFloat(currentValue);

    switch (value) {

        case "%":
            currentValue = String(number / 100);
            break;

        case "1/x":
            if (number === 0) {
                currentValue = "Cannot divide by zero";
                updateDisplay();
                clearAll();
                return;
            }

            currentValue = String(1 / number);
            break;

        case "X²":
            currentValue = String(number * number);
            break;

        case "²√x":
            if (number < 0) {
                currentValue = "Invalid input";
                updateDisplay();
                clearAll();
                return;
            }

            currentValue = String(Math.sqrt(number));
            break;

        case "+/-":
            currentValue = String(number * -1);
            break;
    }

    currentValue = String(
        Number(Number(currentValue).toPrecision(12))
    );

    updateDisplay();
}


// BUTTON CLICK EVENTS


buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;

        if (!value) return;

        if (/^[0-9]$/.test(value)) {
            inputNumber(value);
        }

        else if (value === ".") {
            inputDecimal();
        }

        else if (["+", "-", "×", "÷"].includes(value)) {
            selectOperator(value);
        }

        else if (value === "=") {
            calculate();
        }

        else if (value === "C") {
            clearAll();
        }

        else if (value === "CE") {
            clearEntry();
        }

        else if (value === "⌫") {
            backspace();
        }

        else {
            specialOperation(value);
        }

    });

});



// RESET CALCULATOR


function resetCalculator() {

    previousValue = null;
    operator = null;
    waitingForNewValue = true;

    calculation.textContent = "";
}



// LIGHT / DARK THEME


const savedTheme = localStorage.getItem("calculatorTheme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-theme");
    themeToggle.checked = true;

}

themeToggle.addEventListener("change", function () {

    if (this.checked) {

        document.body.classList.add("dark-theme");

        localStorage.setItem("calculatorTheme", "dark");

    } else {

        document.body.classList.remove("dark-theme");

        localStorage.setItem("calculatorTheme", "light");

    }

});



updateDisplay();
