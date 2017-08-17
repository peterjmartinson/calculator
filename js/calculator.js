/**
 *  Two parts to each operation:
 *    1. Calculation result
 *    2. Followup calculation
*/
let Calculator = function() {
  'use strict';

  let key_press = '',
      previous_keypress = '',
      register = ['','','','',''],
      screen_flag = 0,
      state = 1;

  let first_number = '',
      second_number = '',
      third_number = '',
      first_operator = '',
      second_operator = '';

// ========================================== STATE
/*
 *           A | B | C |opA|opB|
 *          ---|---|---|---|---|
 * State 1) 0,A|   |   |   |   |
 * State 2)  A |   |   | + |   |
 * State 3)  A | B |   |+,*|   |
 * State 4)  A | B |   | + | * |
 * State 5)  A | B | C | + | * |
**/

  function setState(new_state) {
    state = new_state;
  }

  function getState() {
    return state;
  }

  function setCalculatorState() {
      if (first_operator === '') {
        setState(1);
      } else if (first_operator !== '' && register[1] === '') {
        setState(2);
      } else if (first_operator !== '' && first_number !== '' && register[4] === '') {
        setState(3);
      } else if (register[4] !== '' && register[2] === '') {
        setState(4);
      } else if (register[4] !== '' && register[2] !== '') {
        setState(5);
      }
  }

// ========================================== KEY ROUTING
  function sendKeyPress(key) {
    setKeyPress(key);
    routeKeyPress();
    setCalculatorState();
    updateScreen();
    document.getElementById("cowport").innerHTML = logInternals();
  }

  function setKeyPress(new_keypress) {
    key_press = new_keypress.toString();
  }

  function getKeyPress() {
    return key_press;
  }

  function routeKeyPress() {
    let number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        operator = ['+', '-', '*', '/'];
    if ( key_press === 'clear' ) {
      clear();
    }
    else if ( isError() ) {
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
        first_operator = '';
      }
      setOperator();
    }
    else if ( key_press === '=' ) { 
      runEquals();
    }
    else if ( key_press === 'pm' ) {
      setSign();
    }
    else if ( key_press === '.' ) {
      if (previous_keypress == '=') {
        clear();
      }
      setDecimal();
    }
    else if ( key_press === 'root' ) {
      calculateSquareRoot();
    }
    previous_keypress = getKeyPress();
  }

// =========================================== SCREEN
  function setScreenFlag(flag) {
    screen_flag = flag;
  }

  function getScreenFlag(flag) {
    return screen_flag;
  }

  function logInternals() {
    let cow_organ = [];
    cow_organ.push( first_number == '' ? '&nbsp;' : first_number );
    cow_organ.push( register[1] == '' ? '&nbsp;' : register[1] );
    cow_organ.push( register[2] == '' ? '&nbsp;' : register[2] );
    cow_organ.push( first_operator == '' ? '&nbsp;' : first_operator );
    cow_organ.push( register[4] == '' ? '&nbsp;' : register[4] );
    // for (let i = 0; i < register.length; i++) {
    //   cow_organ.push( register[i] == '' ? '&nbsp;' : register[i] );
    // }
    let output = '';
    output += '   <ul>'
    output += '     <li>'
    output += '       <span>Register 1</span><span>' + cow_organ[0] + '</span>'
    output += '     </li>'
    output += '     <li>'
    output += '       <span>Register 2</span><span>' + cow_organ[1] + '</span>'
    output += '     </li>'
    output += '     <li>'
    output += '       <span>Register 3</span><span>' + cow_organ[2] + '</span>'
    output += '     </li>'
    output += '     <li>'
    output += '       <span>Operator 1</span><span>' + cow_organ[3] + '</span>'
    output += '     </li>'
    output += '     <li>'
    output += '       <span>Operator 2</span><span>' + cow_organ[4] + '</span>'
    output += '     </li>'
    output += '     <li>'
    output += '       <span>State</span><span>' + state + '</span>'
    output += '     </li>'
    output += '     <li>'
    output += '       <span>On Screen</span><span>' + document.getElementById("screen").innerHTML + '</span>'
    output += '     </li>'
    output += '   </ul>'
    return output;
  }

  function updateScreen() {
    let screen = document.getElementById("screen");
    if (getScreenFlag() === 0) {
       if (first_number === '') {
          screen.innerHTML = '0';
       } else {
          screen.innerHTML = first_number;
       }
    }
    if (getScreenFlag() === 1) {
       screen.innerHTML = register[1];
    }
    if (getScreenFlag() === 2) {
       screen.innerHTML = register[2];
    }
  }

// ============================================ UTILITY
  function trim(num) {
     var numLen, truncLen, tempVal;
     numLen = num.toString().length;
     truncLen = (Math.trunc(Number(num))).toString().length;
     if (numLen === truncLen && numLen > 10) {
        num = 'ERROR';
     } else if (numLen > truncLen) {
        tempVal = (Math.round(Number(num) * Math.pow(10, (9 - truncLen)))) / Math.pow(10, (9 - truncLen));
        num = tempVal.toString();
     }
     return num.toString();
  }

// ========================================== OPERATIONS
  function operate(l, o, r) {
     l = Number(l);
     r = Number(r);
     if ( !r || !o ) {
       return trim(l);
     }
     if (o === '+') {
        return trim((l + r));
     }
     if (o === '-') {
        return trim((l - r));
     }
     if (o === '*') {
        return trim((l * r));
     }
     if (o === '/') {
        if (r === 0) {
           return 'DIV BY 0';
        }
        return trim((l / r));
     }
  }

  function reckonAll() {
    if (isError()) return;
    let temp_register = register[2];
    reckonInside();
    reckonOutside();
    register[1] = temp_register;
    first_operator = register[4];
    register[4] = '';
  }

  function reckonInside() {
    if (isError()) return;
    if (register[2] == '0' && register[4] == '/') {
      divisionByZero();
      return;
    }
    // handle the "7+=" case
    if (register[2] === '') {
      register[2] = register[1]
    }
    let result = operate(register[1], register[4], register[2]);
    register[1] = result.toString();
    register[2] = '';
    setScreenFlag(1);
  }

  function reckonOutside() {
    if (isError()) return;
    if (register[1] == '0' && first_operator == '/') {
      divisionByZero();
      return;
    }
    if (getState() === 2) {
      register[1] = first_number;
    }
    let result = operate(first_number, first_operator, register[1]);
    first_number = result.toString();
    setScreenFlag(0);
  }

  function runEquals() {
    if (isError()) return;
    switch(getState()) {
      case 1:
      case 2:
      case 3:
      case 4:
        reckonOutside();
        break;
      case 5:
        reckonAll();
        break;
      default:
        console.log("Something other than Equals happened!");
        break;
    }
  }


// ============================================= ERROR HANDLING
  function divisionByZero() {
    first_number = 'DIV BY 0';
    register[1] = 'DIV BY 0';
    register[2] = 'DIV BY 0';
    first_operator = '';
    register[4] = '';
    setScreenFlag(0);
  }

  function setError() {
    first_number = 'ERROR';
    register[1] = 'ERROR';
    register[2] = 'ERROR';
    first_operator = '';
    register[4] = '';
    setScreenFlag(0);
  }

  function isError() {
    return first_number === 'ERROR' || first_number === 'DIV BY 0' || first_number === 'NaN' ? 1 : 0;
  }

  function clear() {
     first_number = '';
     register[1] = '';
     register[2] = '';
     first_operator = '';
     register[4] = '';
     document.getElementById('screen').innerHTML = '0';
     setScreenFlag(0);
     setCalculatorState();
  }

// =========================================== CASE STATEMENTS

  function setNumber() {
    switch(getState()) {
      case 1:
        appendFirstNumber();
        break;
      case 2:
      case 3:
        appendSecondNumber();
        break;
      case 4:
      case 5:
        appendThirdNumber();
        break;
      default:
         console.log("something other than NUMBER happened!");
         break;
    }
  }

  function setOperator() {
    switch (getState()) {
      case 1: // 0,A|   |   |   |   |
      case 2: //  A |   |   | + |   |
        changeOuterCalculation();
        break;
      case 3: //  A | B |   |+,*|   |
        beginInnerCalculation();
        break;
      case 4: //  A | B |   | + | * |
        completeInnerCalculation();
        break;
      case 5: //  A | B | C | + | * |
        continueInnerCalculation();
        break;
      default:
        console.log("something other than OPERATOR happened!");
        break;
    }
  }

  function setSign() {
    switch (getState()) {
      case 1:
        flipFirstSign();
        break;
      case 2:
        transferAndFlipFirstSign();
        break;
      case 3:
        flipSign(1);
        break;
      case 4:
        flipSignAndTransfer(1);
        break;
      case 5:
        flipSign(2);
        break;
      default:
        console.log("something other than PLUS-MINUS happened!");
        break;
    }
  }

  function setDecimal() {
    switch (getState()) {
      case 1:
         setFirstDecimal();
         break;
      case 2:
         startNewDecimal(1);
         break;
      case 3:
         appendDecimal(1);
         break;
      case 4:
         startNewDecimal(2);
         break;
      case 5:
         appendDecimal(2);
         break;
      default:
         console.log("something other than . happened!");
         break;
    }
  }

  function calculateSquareRoot() {
    switch (getState()) {
      case 1:
         calculateFirstRoot();
         break;
      case 2:
         transferFirstRoot();
         break;
      case 3:
         takeSquareRoot(1);
         break;
      case 4:
         transferSquareRoot(1);
         break;
      case 5:
         takeSquareRoot(2);
         break;
      default:
         console.log("something other than root happened!");
         break;
    }
  }

// ============================================ REGISTER MANIPULATION

  function appendFirstNumber() {
    if (first_number.length < 10) {
      first_number += getKeyPress();
    }
  }

  function appendSecondNumber() {
    // if (first_number.length < 10) {
    //   first_number += getKeyPress();
    // }
    if (register[1].length < 10) {
      register[1] += getKeyPress();
    }
  }

  function appendThirdNumber() {
    // if (first_number.length < 10) {
    //   first_number += getKeyPress();
    // }
    if (register[2].length < 10) {
      register[2] += getKeyPress();
    }
  }

  function appendNumber(index) {
    appendToRegister(index);
  }

  function changeOuterCalculation() {
    first_operator = getKeyPress();
  }

  function beginInnerCalculation() {
    if ((getKeyPress() === '*' || getKeyPress() === '/') && (first_operator === '+' || first_operator === '-')) {
      register[4] = getKeyPress();
      setScreenFlag(1);
    } else {
      reckonOutside();
      register[1] = '';
      first_operator = getKeyPress();
      setScreenFlag(0);
    }
  }

  function completeInnerCalculation() {
    if (getKeyPress() === '+' || getKeyPress() === '-') {
      runEquals();
      first_operator = getKeyPress();
      setScreenFlag(0);
    } else {
      register[4] = getKeyPress();
      setScreenFlag(1);
    }
  }

  function continueInnerCalculation() { // case 5
    if (getKeyPress() === '+' || getKeyPress() === '-') {
      reckonAll();
      register[1] = '';
      register[2] = '';
      first_operator = getKeyPress();
      register[4] = '';
    } else {
      reckonInside();
      register[4] = getKeyPress();
      setScreenFlag(1);
    }
  }
    
  function updateRegister(index) {
    if (isOperator(index)) {
      clearRegister(index);
    }
    appendToRegister(index);
  }

  function targetRegisterIsEmpty(index) {
    return !register[index];
  }

  function isOperator(index) {
    let operators = ['+','-','*','/']
    return operators.indexOf(register[index]) !== -1;
  }

  function clearRegister(index) {
    register[index] = '';
  }

  function appendToRegister(index) {
    if ( targetRegisterIsAppendable(index) ) {
      register[index] += getKeyPress();
    }
  }

  function targetRegisterIsAppendable(index) {
    return register[index].length < 10;
  }

  function flipFirstSign() {
    first_number = Number(first_number * -1).toString();
    setScreenFlag(0);
  }

  function transferAndFlipFirstSign() {
    register[1] = Number(first_number * -1).toString();
    setScreenFlag(1);
  }

  function flipSign(index) {
    register[index] = Number(register[index] * -1).toString();
    setScreenFlag(index);
  }

  function flipSignAndTransfer(index) {
    register[index+1] = Number(register[index] * -1).toString();
    setScreenFlag(index);
  }

  function setFirstDecimal() {
    if (first_number === '' || first_number === '0') {
       first_number = '0.';
    } else {
      first_number += first_number.length < 10 ? '.' : '';
    }
  }

  function appendDecimal(index) {
    if (register[index].indexOf('.') === -1 && register[index].length < 10) {
      register[index] = register[index] + '.';
    }
  }

  function startNewDecimal(index) {
    register[index] = '0.';
    if ( getState > 1 ) {
      setScreenFlag(index);
    }
  }

  function calculateFirstRoot() {
    if (first_number > 0) {
      first_number = trim(Math.sqrt(Number(first_number)).toString());
      setScreenFlag(0);
    } else if (first_number === '' || first_number === '0') {
      first_number = '0';
      setScreenFlag(0);
    } else {
      setError();
    }
  }

  function transferFirstRoot() {
    if (first_number > 0) {
      register[1] = trim(Math.sqrt(Number(first_number)).toString());
      setScreenFlag(1);
    } else {
      setError();
    }
  }

  function takeSquareRoot(index) {
    if (register[index] > 0) {
      register[index] = trim(Math.sqrt(Number(register[index])).toString());
      setScreenFlag(index);
    } else if (register[index] === '' || register[index] === '0') {
      register[index] = '0';
      setScreenFlag(index);
    } else {
      setError();
    }
  }

  function transferSquareRoot(index) {
    if (register[index] > 0) {
      register[index + 1] = trim(Math.sqrt(Number(register[index])).toString());
      setScreenFlag(index + 1);
    } else {
      setError();
    }
  }

  return {
    sendKeyPress        : sendKeyPress,
    register            : register
  };


};
