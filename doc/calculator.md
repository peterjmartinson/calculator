JavaScript Calculator
=====================

[IMAGE](LINK)

  #JavaScript #QUnit #CSS

## Description

I wanted to make a calculator that acts exactly like a simple desktop calculator.  It needed to operate naturally and be able to keep a running tally.  These requirements meant 1) no Reverse Polish Notation, and 2) no `exec()`.

After working out a rough first draft, I realized how convenient it would be to have a suite of fundamental tests to run on the logic.  Punching out a sequence of keystrokes each time was not just random but also tedious.  Hence, my entry into the land of unit testing.

## Execution

When a user hits a button, a string is passed to `sendKeyPress()`.

<pre class="prettyprint linenum">
function sendKeyPress(key) {
  identifyKeyPress(key);
  routeKeyPress();
  setCalculatorState();
  updateScreen();
  document.getElementById("cowport").innerHTML = logInternals();
}
</pre>

`sendKeyPress()` then sets off a chain reaction.  First, `identifyKeyPress` assigns the proper value to the `key_press` instance variable.  `routeKeyPress` then calls one of several functions, depending on the type of key pressed (number, operator, square root, etc.).

<pre class="prettyprint linenum">
function routeKeyPress() {
  let number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      operator = ['+', '-', '*', '/'];
  if ( key_press === 'clear' ) {
    clear();
  }
  else if ( getError() ) {
    return;
  }
  else if ( number.indexOf(key_press) > -1 ) {
    if (previous_keypress == '=') {
      clear();
    }
    setNumber();
  }
  else if ( operator.indexOf(key_press) > -1 ) {
    if (previous_keypress == '=') {
      register[3] = '';
    }
    setOperator();
  }
  else if ( key_press === '=' ) { 
    reckonAll();
  }
  else if ( key_press === 'pm' ) {
    flipSign();
  }
  else if ( key_press === '.' ) {
    if (previous_keypress == '=') {
      clear();
    }
    appendDecimal();
  }
  else if ( key_press === 'root' ) {
    calculateSquareRoot();
  }
  previous_keypress = getKeyPress();
}
</pre>

The calculator stores keypresses in an array of length 5: three numbers and two operators.  Though the user is unaware, the organization here is reverse polish notation, and most of the calculator logic is needed to route the key presses into the correct array location.  Each type of key entry is run through its own `switch` statement, which checks what *state* the calculator is in.  `state` itself is an integer that indicates how the calculator should behave for the next key press.  It is accessed for each type of key press below.

If a number was pressed, `setNumber()` decides whether the number should be appended to the current register, or sent to the next register, using a `switch` statement.

<pre class="prettyprint linenum">
function setNumber() {
  switch(getState()) {
    case 1:
      setScreenFlag(1);
      if (register[0] === '' || register[0] === '0') {
        register[0] = getKeyPress();
      } else if (register[0].length < 10) {
        register[0] = register[0] + getKeyPress();
      }
      break;
    case 2:
      setScreenFlag(2);
      if (register[1] === '' || register[1] === '0') {
        register[1] = getKeyPress();
      } else if (register[1].length < 10) {
        register[1] = register[1] + getKeyPress();
      }
      break;
    case 3:
      if (register[1] === '' || register[1] === '0') {
        register[1] = getKeyPress();
      } else if (register[1].length < 10) {
        register[1] = register[1] + getKeyPress();
      }
      setScreenFlag(2);
      break;
    case 4:
       register[2] = getKeyPress();
       setScreenFlag(3);
       break;
    case 5:
       if (register[2].length < 10) {
          register[2] = register[2] + getKeyPress();
          setScreenFlag(3);
       }
       break;
    default:
       console.log("something other than NUMBER happened!");
       break;
  }
}
</pre>

If an operator was pressed, `setOperator()` decides whether to fill the next operator register with the operator, or to run a calculation loop.  This is where things get complicated, due to order of operations.  Since multiplication and division take precedence over addition or subtraction, if a sequence like `1 + 2 * 3 *` is entered, the `2 * 3` should be evaluated, but not yet added to the 1.  It should end up like `1 + (6 * ...)`.  However, if a user enters `1 + 2 * 3 +`, the `+` should trigger a complete calculation.  First, the expression becomes `1 + 6 +`, and then it becomes `7 + ...`.

My best solution so far is to use a bunch of if-else statements within `setOperator()`'s `switch` statement.  It's not pretty, and at some point I would like to refactor this, but it currently gets the job done.

<pre class="prettyprint linenum">
function setOperator() {
  let key_press = getKeyPress();
  switch (getState()) {
    case 1:
       register[3] = key_press;
       setScreenFlag(1);
       break;
    case 2:
       register[3] = key_press;
       setScreenFlag(1);
       break;
    case 3:
       if ((register[3] === '+' || register[3] === '-') && (key_press === '*' || key_press === '/')) {
          register[4] = key_press;
          setScreenFlag(2);
       } else {
          reckonOutside();
          register[1] = '';
          register[3] = key_press;
          setScreenFlag(1);
       }
       break;
    case 4:
       if (key_press === '+' || key_press === '-') {
          reckonAll();
          register[1] = '';
          register[2] = '';
          register[3] = key_press;
          register[4] = '';
          setScreenFlag(1);
       } else {
          register[4] = key_press;
          setScreenFlag(2);
       }
       break;
    case 5:
       if (key_press === '+' || key_press === '-') {
          reckonAll();
          register[1] = '';
          register[2] = '';
          register[3] = key_press;
          register[4] = '';
          setScreenFlag(1);
       } else {
          register[1] = operate(register[1], register[4], register[2]);
          register[2] = '';
          register[4] = key_press;
          setScreenFlag(2);
       }
       break;
    default:
       console.log("something other than OPERATOR happened!");
       break;
  }
}
</pre>

A similar procedure is followed for each of the other keys (equal, square root, plus-minus, decimal).

After the registers have been properly set and any relevant operations carried out, the calculator state is determined

<pre class="prettyprint linenum">
function setCalculatorState() {
    if (register[3] === '') {
      setState(1);
    } else if (register[3] !== '' && register[1] === '') {
      setState(2);
    } else if (register[3] !== '' && register[0] !== '' && register[4] === '') {
      setState(3);
    } else if (register[4] !== '' && register[2] === '') {
      setState(4);
    } else if (register[4] !== '' && register[2] !== '') {
      setState(5);
    }
}
</pre>

and the correct register is displayed on screen

<pre class="prettyprint linenum">
function updateScreen() {
  let screen = document.getElementById("screen");
  if (getScreenFlag() === 1) {
     if (register[0] === '') {
        screen.innerHTML = '0';
     } else {
        screen.innerHTML = register[0];
     }
  }
  if (getScreenFlag() === 2) {
     screen.innerHTML = register[1];
  }
  if (getScreenFlag() === 3) {
     screen.innerHTML = register[2];
  }
}
</pre>

The Cowport displays the current values in the register array and a few other internals.  "Cowport" is a reference to a disgusting (but apparently useful) surgical implant stuck on a cow's flank, which allows interested passersby to reach in and feel the poor animal's organs.

# Demo
# Source
