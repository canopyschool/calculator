const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const functionsGroup = document.getElementById('functions'); // Reference to the functions group
const basicGroup = document.getElementById('basic'); // Reference to the basic group
const extraPanel = document.getElementById('extrapanel'); // Reference to the new extra panel

let memoryValue = 0; // Memory value initialization

buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const buttonText = button.textContent;

        // Check if the clicked button is a tab button
        if (button.classList.contains('tab-button')) {
            return; // If it's a tab button, do nothing further in this event handler
        }

        handleInput(buttonText);
    });
});

function handleInput(input) {
    if (input === '=' || input === 'Solve') {
        solveExpression(); // Delegate solving to a separate function
    } else if (input === 'C' || input === 'Escape') { // Escape key to clear
        display.value = '';
        display.style.color = 'black'; // Reset color to black
    } else if (['sin', 'cos', 'tan', 'log', 'ln', '√x', 'sinh', 'cosh', 'tanh', 'asin', 'acos', 'atan', 'x²', 'x³', '10^x', 'cbrt', 'x!'].includes(input)) {
        applyFunction(input);
        display.style.color = 'green'; // Change color to green for the result
    } else if (['M+', 'M-', 'MR', 'MC'].includes(input)) {
        handleMemoryFunction(input);
        display.style.color = 'black'; // Reset color to black for memory operations
    } else if (['(', ')'].includes(input)) {
        display.value += input; // Allow brackets to be added to the display
        display.style.color = 'black'; // Reset color to black for ongoing input
    } else {
        // Prevent multiple decimals in the same number
        if (input === '.' && display.value.slice(-1) === '.') {
            return;
        }
        display.value += input;
        display.style.color = 'black'; // Reset color to black for ongoing input
    }
}

function solveExpression() {
    try {
        // Replace ^ with ** for exponentiation and replace π with Math.PI
        const expression = display.value
            .replace(/\^/g, '**')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/x/g, '*'); // Replace 'x' with '*' for multiplication

        // Evaluate the expression and ensure the result is displayed in green
        const result = eval(expression);
        display.value = result;
        display.style.color = 'green'; // Set result color to green
    } catch (error) {
        display.value = 'Error';
        display.style.color = 'red'; // Change color to red for errors
    }
}

function applyFunction(func) {
    const value = parseFloat(display.value);

    // Check if the input is valid
    if (isNaN(value)) {
        display.value = 'Error'; // Handle empty or invalid input
        display.style.color = 'red'; // Indicate error with red text
        return;
    }

    const radians = value * (Math.PI / 180); // Convert degrees to radians for trigonometric functions

    switch (func) {
        case 'sin':
            display.value = Math.sin(radians);
            break;
        case 'cos':
            display.value = Math.cos(radians);
            break;
        case 'tan':
            display.value = Math.tan(radians);
            break;
        case 'sinh':
            display.value = Math.sinh(radians);
            break;
        case 'cosh':
            display.value = Math.cosh(radians);
            break;
        case 'tanh':
            display.value = Math.tanh(radians);
            break;
        case 'asin':
            display.value = Math.asin(value) * (180 / Math.PI); // Convert radians to degrees
            break;
        case 'acos':
            display.value = Math.acos(value) * (180 / Math.PI); // Convert radians to degrees
            break;
        case 'atan':
            display.value = Math.atan(value) * (180 / Math.PI); // Convert radians to degrees
            break;
        case 'log':
            if (value <= 0) {
                display.value = 'Error'; // Logarithm of non-positive numbers is not defined
                display.style.color = 'red';
            } else {
                display.value = Math.log10(value); // log base 10
            }
            break;
        case 'ln':
            if (value <= 0) {
                display.value = 'Error'; // Natural logarithm of non-positive numbers is not defined
                display.style.color = 'red';
            } else {
                display.value = Math.log(value); // natural log, base e
            }
            break;
        case '√x':
            if (value < 0) {
                display.value = 'Error'; // Square root of negative numbers is not a real number
                display.style.color = 'red';
            } else {
                display.value = Math.sqrt(value);
            }
            break;
        case 'x²':
            display.value = Math.pow(value, 2);
            break;
        case 'x³':
            display.value = Math.pow(value, 3);
            break;
        case '10^x':
            display.value = Math.pow(10, value);
            break;
        case 'cbrt':
            display.value = Math.cbrt(value);
            break;
        case 'x!':
            display.value = factorial(value);
            break;
        default:
            display.value = 'Error';
            display.style.color = 'red';
    }
    display.style.color = 'green'; // Ensure result is green
}

function handleMemoryFunction(func) {
    const currentValue = parseFloat(display.value) || 0;
    switch (func) {
        case 'M+':
            memoryValue += currentValue;
            break;
        case 'M-':
            memoryValue -= currentValue;
            break;
        case 'MR':
            display.value = memoryValue;
            break;
        case 'MC':
            memoryValue = 0;
            break;
        default:
            display.value = 'Error';
            display.style.color = 'red';
    }
}

function factorial(n) {
    if (n < 0) return 'Error'; // Factorial is not defined for negative numbers
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}
function adjustCalculatorPosition() {
    const container = document.querySelector('.container');
    const calculator = document.querySelector('.calculator');
    const functionsActive = functionsGroup.classList.contains('active');
    const extraActive = extraPanel.classList.contains('active');

    const extraPanelWidth = 200; // Width of the extra panel
    const functionPanelWidth = 300; // Width of the functions panel
    const screenWidth = window.innerWidth; // Width of the screen

    let totalShift = 0;

    if (functionsActive && extraActive) {
        // If both panels are open, calculate the shift to keep the calculator centered
        totalShift = -(extraPanelWidth - functionPanelWidth) / 2;
        calculator.style.width = '600px'; // Set width to 600px when either panel is open
    } else if (functionsActive) {
        // If only the functions panel is open, shift the calculator to the left
        totalShift = -(functionPanelWidth / 2);
        calculator.style.width = '600px'; // Set width to 600px when either panel is open
    } else if (extraActive) {
        // If only the extra panel is open, shift the calculator to the right
        totalShift = extraPanelWidth / 2;
        calculator.style.width = '600px'; // Set width to 600px when either panel is open
    } else {
        totalShift = 0; // Center the calculator when neither are open
        calculator.style.width = '900px'; // Reset width to default when no panel is open
    }

    // Apply the calculated shift to the container
    container.style.transform = `translateX(${totalShift}px)`;
}


function switchTab(tabName) {
    // Handle the functions panel and basic group independently
    if (tabName === 'functions') {
        if (functionsGroup.classList.contains('active')) {
            functionsGroup.classList.remove('active');
            document.querySelector('button[onclick="switchTab(\'functions\')"]').classList.remove('active');
            document.querySelector('button[onclick="switchTab(\'basic\')"]').classList.add('active');
        } else {
            functionsGroup.classList.add('active');
            document.querySelector('button[onclick="switchTab(\'functions\')"]').classList.add('active');
            document.querySelector('button[onclick="switchTab(\'basic\')"]').classList.remove('active');
        }
    } else if (tabName === 'basic') {
        functionsGroup.classList.remove('active');
        document.querySelector('button[onclick="switchTab(\'basic\')"]').classList.add('active');
        document.querySelector('button[onclick="switchTab(\'functions\')"]').classList.remove('active');
    } else if (tabName === 'extrapanel') {
        // Toggle the extra panel's visibility independently
        extraPanel.classList.toggle('active');
        const askAvaButton = document.querySelector('button[onclick="switchTab(\'extrapanel\')"]');
        askAvaButton.classList.toggle('active');
    }

    // Ensure only one of the Basic or Functions tabs is highlighted
    if (!functionsGroup.classList.contains('active') && !extraPanel.classList.contains('active')) {
        document.querySelector('button[onclick="switchTab(\'basic\')"]').classList.add('active');
        document.querySelector('button[onclick="switchTab(\'functions\')"]').classList.remove('active');
    } else if (functionsGroup.classList.contains('active')) {
        document.querySelector('button[onclick="switchTab(\'basic\')"]').classList.remove('active');
    }

    adjustCalculatorPosition(); // Adjust the calculator's position after toggling
}






// Set up default tab
document.addEventListener('DOMContentLoaded', function() {
    switchTab('basic');
});

document.addEventListener('keydown', function(event) {
    const key = event.key;
    const activeElement = document.activeElement;

    // Check if the active element is the search bar input
    if (activeElement && activeElement.tagName.toLowerCase() === 'input' && activeElement.classList.contains('search-input')) {
        return; // Don't trigger calculator functions if typing in the search bar
    }

    // Handle the backspace key
    if (key === 'Backspace') {
        display.value = display.value.slice(0, -1);
    } else if (key === 'Enter') {
        event.preventDefault(); // Prevent the default action that might cause issues
        solveExpression(); // Trigger the solve function
    } else if (!isNaN(key) || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
        event.preventDefault(); // Prevent the key from being added again
        handleInput(key);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.getElementById('voiceflow-iframe');

    if (iframe) {
        const iframeDoc = iframe.contentWindow.document;
        const script = iframeDoc.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs';

        script.onload = function() {
            // Load the Voiceflow chat widget
            iframe.contentWindow.voiceflow.chat.load({
                verify: { projectID: '66c901330e51083b58d558d1' },
                url: 'https://general-runtime.voiceflow.com',
                versionID: 'production',
                assistant: { stylesheet: "https://naxosdigitals.github.io/stylesheets/calculatorstyles.css" }
            }).then(() => {
                // Add a small timeout and then auto-open the widget
                setTimeout(() => {
                    iframe.contentWindow.voiceflow.chat.open();
                    addMessageListener();
                }, 500); // Adjust the timeout duration as needed
            }).catch(error => {
                console.error('Error opening Voiceflow chat:', error);
            });
        };

        // Append the script to the iframe document
        iframeDoc.body.appendChild(script);
    }
});

function addMessageListener() {
    // This function can be used to add any event listeners or handle messages
    //console.log('Voiceflow chat is open and ready.');
}


