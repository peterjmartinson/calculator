let Calculator = function() {
  'use strict';

  let key_press = '',
      previous_keypress = '',
      register = ['','','','',''],
      screen_flag = 1,
      state = 1;

// ========================================== STATE
  function setState(new_state) {
    state = new_state;
  }

  function getState() {
    return state;
  }

  /*
   * DETERMINE CALCULATOR STATE
   *
   *          A | B | C |opA|opB|
   *         ---|---|---|---|---|
   * Case 1) 0,A|   |   |   |   |
   * Case 2)  A |   |   | + |   |
   * Case 3)  A | B |   |+,*|   |
   * Case 4)  A | B |   | + | * |
   * Case 5)  A | B | C | + | * |
   */
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

// =========================================== SCREEN
  function setScreenFlag(flag) {
    screen_flag = flag;
  }

  function getScreenFlag(flag) {
    return screen_flag;
  }

  function logInternals() {
    let cow_organ = [];
    for (let i = 0; i < register.length; i++) {
      cow_organ.push( register[i] == '' ? '&nbsp;' : register[i] );
    }
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

  function reckonInside() {
    if (register[0] == 'ERROR' || register[0] == 'NaN') {
      return;
    }
    if (register[2] == '0' && register[4] == '/') {
      divisionByZero();
      return;
    }
    if (register[2] === '') {
      register[2] = register[1]
    }
    let result = operate(register[1], register[4], register[2]);
    register[1] = result.toString();
    setScreenFlag(2);
  }

  function reckonOutside() {
    if (register[0] == 'ERROR' || register[0] == 'NaN' || register[0] == 'DIV BY 0') return;
    if (register[1] == '0' && register[3] == '/') {
      divisionByZero();
      return;
    }
    if (register[1] === '') {
      register[1] = register[0]
    }
    let result = operate(register[0], register[3], register[1]);
    register[0] = result.toString();
    setScreenFlag(1);
  }

  function reckonAll() {
    if (register[0] == 'ERROR' || register[0] == 'NaN') return;
    if (register[1] != '' && register[2] != '' && register[4] != '') {
      reckonInside();
      reckonOutside();
    } else {
      reckonOutside();
    }
  }

// ============================================= ERROR HANDLING
  function divisionByZero() {
    register[0] = 'DIV BY 0';
    register[1] = 'DIV BY 0';
    register[2] = 'DIV BY 0';
    register[3] = '';
    register[4] = '';
    setScreenFlag(1);
  }

  function setError() {
    register[0] = 'ERROR';
    register[1] = 'ERROR';
    register[2] = 'ERROR';
    register[3] = '';
    register[4] = '';
    setScreenFlag(1);
  }

  function getError() {
    return register[0] === 'ERROR' || register[0] === 'DIV BY 0' ? 1 : 0;
  }

// =========================================== ULTIMATE ACTIONS
  function clear() {
     register[0] = '';
     register[1] = '';
     register[2] = '';
     register[3] = '';
     register[4] = '';
     document.getElementById('screen').innerHTML = '0';
     setScreenFlag(1);
     setCalculatorState();
  }

  function setNumber() {
    switch(getState()) {
      case 1:
        setScreenFlag(1);
        updateRegister(0);
        // if (register[0] === '' || register[0] === '0') {
        //   register[0] = getKeyPress();
        // } else if (register[0].length < 10) {
        //   register[0] = register[0] + getKeyPress();
        // }
        break;
      case 2:
        setScreenFlag(2);
        updateRegister(1);
        // if (register[1] === '' || register[1] === '0') {
        //   register[1] = getKeyPress();
        // } else if (register[1].length < 10) {
        //   register[1] = register[1] + getKeyPress();
        // }
        break;
      case 3:
        // if (register[1] === '' || register[1] === '0') {
        //   register[1] = getKeyPress();
        // } else if (register[1].length < 10) {
        //   register[1] = register[1] + getKeyPress();
        // }
        setScreenFlag(2);
        updateRegister(1);
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

  function updateRegister(index) {
    if (overwriteRegister(index)) {
      register[index] = getKeyPress();
    }
    else if (appendToRegister(index)) {
      register[index] = register[index] + getKeyPress();
    }
  }

  function overwriteRegister(index) {
    return register[index] === '' || register[index] === '0';
  }

  function appendToRegister(index) {
    return register[index].length < 10;
  }

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

  function flipSign() {
    switch (getState()) {
      case 1:
        if (register[0] !== 'empty' && register[0] !== '0') {
          register[0] = Number(register[0] * -1).toString();
          setScreenFlag(1);
        }
        break;
      case 2:
        register[1] = Number(register[0] * -1).toString();
        setScreenFlag(2);
        break;
      case 3:
        register[1] = Number(register[1] * -1).toString();
        setScreenFlag(2);
        break;
      case 4:
        register[2] = Number(register[1] * -1).toString();
        setScreenFlag(3);
        break;
      case 5:
        register[2] = Number(register[2] * -1).toString();
        setScreenFlag(3);
        break;
      default:
        console.log("something other than PLUS-MINUS happened!");
        break;
    }
  }

  function appendDecimal() {
    switch (getState()) {
      case 1:
         if (register[0].indexOf('.') === -1 && register[0].length < 10) {
            if (register[0] === '' || register[0] === '0') {
               register[0] = '0.';
            } else {
               register[0] = register[0] + '.';
            }
         }
         break;
      case 2:
         register[1] = '0.';
         setScreenFlag(2);
         break;
      case 3:
         if (register[1].indexOf('.') === -1 && register[1].length < 10) {
            register[1] = register[1] + '.';
         }
         break;
      case 4:
         register[2] = '0.';
         setScreenFlag(3);
         break;
      case 5:
         if (register[2].indexOf('.') === -1 && register[2].length < 10) {
            register[2] = register[2] + '.';
         }
         break;
      default:
         console.log("something other than . happened!");
         break;
    }
  }

  function calculateSquareRoot() {
    switch (getState()) {
      case 1:
         if (register[0] > 0) {
            register[0] = trim(Math.sqrt(Number(register[0])).toString());
            setScreenFlag(1);
         } else if (register[0] === '' || register[0] === '0') {
            register[0] = '0';
            setScreenFlag(1);
         } else {
            setError();
         }
         break;
      case 2:
         if (register[0] > 0) {
            register[1] = trim(Math.sqrt(Number(register[0])).toString());
            setScreenFlag(2);
         } else {
            setError();
         }
         break;
      case 3:
         if (register[1] > 0) {
            register[1] = trim(Math.sqrt(Number(register[1])).toString());
            setScreenFlag(2);
         } else {
            setError();
         }
         break;
      case 4:
         if (register[1] > 0) {
            register[2] = trim(Math.sqrt(Number(register[1])).toString());
            setScreenFlag(3);
         } else {
            setError();
         }
         break;
      case 5:
         if (register[2] > 0) {
            register[2] = trim(Math.sqrt(Number(register[2])).toString());
            setScreenFlag(3);
         } else {
            setError();
         }
         break;
      default:
         console.log("something other than root happened!");
         break;
    }
  }

  return {
    trim                : trim,
    operate             : operate,
    setCalculatorState  : setCalculatorState,
    clear               : clear,
    updateScreen        : updateScreen,
    setNumber           : setNumber,
    setOperator         : setOperator,
    reckonInside        : reckonInside,
    reckonOutside       : reckonOutside,
    reckonAll           : reckonAll,
    getKeyPress         : getKeyPress,
    setKeyPress         : setKeyPress,
    routeKeyPress       : routeKeyPress,
    flipSign            : flipSign,
    appendDecimal       : appendDecimal,
    calculateSquareRoot : calculateSquareRoot,
    sendKeyPress        : sendKeyPress,
    register            : register,
    getScreenFlag       : getScreenFlag,
    setScreenFlag       : setScreenFlag,
    setState            : setState,
    getState            : getState,
    divisionByZero      : divisionByZero,
    setError            : setError,
    getError            : getError,
    logInternals        : logInternals
  };


};
