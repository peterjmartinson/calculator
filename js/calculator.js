/**
 * 
 * 
*/
let Calculator = function() {
  'use strict';


  let key_press = '',
      previous_keypress = '';

  let register = ['','',''];
  let operator = ['',''];
  let screen_flag = 1;
  let state = 1;

  let buffer = {
    register_a  : '',
    register_b  : '',
    register_c  : '',
    operator_a  : '',
    operator_b  : '',
    screen_flag : 1, // 1 -> show register_a, 2 -> show register_b, 3 -> show register_c
    state       : 1
  };


  function sendKeyPress(key) {
    setKeyPress(key);
    routeKeyPress();
    setState();
    updateScreen();
    document.getElementById("cowport").innerHTML = logInternals();
  }

  function getKeyPress() {
    return key_press;
  }

  function setKeyPress(new_keypress) {
    key_press = new_keypress.toString();
  }

  function setScreenFlag(flag) {
    screen_flag = flag;
  }

  function getScreenFlag(flag) {
    return screen_flag;
  }

  function logInternals() {
    let output = '';
    output += register[0] + ', ';
    output += register[1] + ', ';
    output += register[2] + ', ';
    output += operator[0] + ', ';
    output += operator[1] + ', ';
    output += getScreenFlag() + ', ';
    output += document.getElementById('screen').innerHTML + ', ';
    output += buffer.state;
    return output;
  }

  function routeKeyPress() {
    let number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        operator = ['+', '-', '*', '/'];
    if ( number.indexOf(key_press) > -1 ) {
      setNumber();
    }
    else if ( operator.indexOf(key_press) > -1 ) {
      if (previous_keypress == '=') {
        operator[0] = '';
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
      appendDecimal();
    }
    else if ( key_press === 'root' ) {
      calculateSquareRoot();
    }
    else if ( key_press === 'clear' ) {
      clear();
    }
    previous_keypress = getKeyPress();
  }

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
    if (register[2] == '0' && operator[1] == '/') {
      divisionByZero();
      return;
    }
    if (register[2] === '') {
      register[2] = register[1]
    }
    let result = operate(register[1], operator[1], register[2]);
    register[1] = result.toString();
    setScreenFlag(2);
    // buffer.screen_flag = 2;
  }

  function reckonOutside() {
    if (register[0] == 'ERROR' || register[0] == 'NaN') return;
    if (register[1] == '0' && operator[0] == '/') {
      divisionByZero();
      return;
    }
    if (register[1] === '') {
      register[1] = register[0]
    }
    let result = operate(register[0], operator[0], register[1]);
    register[0] = result.toString();
    setScreenFlag(1);
    // buffer.screen_flag = 1;
  }

  function reckonAll() {
    if (register[0] == 'ERROR' || register[0] == 'NaN') return;
    if (register[1] != '' && register[2] != '' && operator[1] != '') {
      reckonInside();
      reckonOutside();
    } else {
      reckonOutside();
    }
  }

  function divisionByZero() {
    register[0] = 'DIV BY 0';
    register[1] = 'DIV BY 0';
    register[2] = 'DIV BY 0';
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
  function setState() {
      if (register[0] === 'DIV BY 0' || register[1] === 'DIV BY 0') {
        buffer.state = 6;
      } else if (register[0] === 'ERROR' || register[1] === 'ERROR') {
        buffer.state = 6;
      } else if (operator[0] === '') {
        buffer.state = 1;
      } else if (operator[0] !== '' && register[1] === '') {
        buffer.state = 2;
      } else if (operator[0] !== '' && register[0] !== '' && operator[1] === '') {
        buffer.state = 3;
      } else if (operator[1] !== '' && register[2] === '') {
        buffer.state = 4;
      } else if (operator[1] !== '' && register[2] !== '') {
        buffer.state = 5;
      }
  }

  function updateScreen() {
    let screen = document.getElementById("screen");
    if (getScreenFlag() === 1) {
    // if (buffer.screen_flag === 1) {
       if (register[0] === '') {
          screen.innerHTML = '0';
       } else {
          screen.innerHTML = register[0];
       }
    }
    if (getScreenFlag() === 2) {
    // if (buffer.screen_flag === 2) {
       screen.innerHTML = register[1];
    }
    if (getScreenFlag() === 3) {
    // if (buffer.screen_flag === 3) {
       screen.innerHTML = register[2];
    }
  }

  function clear() {
     register[0] = '';
     register[1] = '';
     register[2] = '';
     operator[0] = '';
     operator[1] = '';
     document.getElementById('screen').innerHTML = '0';
     setScreenFlag(1);
     // buffer.screen_flag = 1;
     setState();
  }

  function setNumber() {
    switch(buffer.state) {
      case 1:
        setScreenFlag(1);
        // buffer.screen_flag = 1;
        if (register[0] === '' || register[0] === '0') {
          register[0] = getKeyPress();
        } else if (register[0].length < 10) {
          register[0] = register[0] + getKeyPress();
        }
        break;
      case 2:
        setScreenFlag(2);
        // buffer.screen_flag = 2;
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
        // buffer.screen_flag = 2;
        break;
      case 4:
         register[2] = getKeyPress();
         setScreenFlag(3);
         // buffer.screen_flag = 3;
         break;
      case 5:
         if (register[2].length < 10) {
            register[2] = register[2] + getKeyPress();
            setScreenFlag(3);
            // buffer.screen_flag = 3;
         }
         break;
      case 6:
         break;
      default:
         console.log("something other than NUMBER happened!");
         break;
    }
  }

  function setOperator() {
    let key_press = getKeyPress();
    switch (buffer.state) {
      case 1:
         operator[0] = key_press;
         setScreenFlag(1);
         // buffer.screen_flag = 1;
         break;
      case 2:
         operator[0] = key_press;
         setScreenFlag(1);
         // buffer.screen_flag = 1;
         break;
      case 3:
         if ((operator[0] === '+' || operator[0] === '-') && (key_press === '*' || key_press === '/')) {
            operator[1] = key_press;
            setScreenFlag(2);
            // buffer.screen_flag = 2;
         } else {
            reckonOutside();
            register[1] = '';
            operator[0] = key_press;
            setScreenFlag(1);
            // buffer.screen_flag = 1;
         }
         break;
      case 4:
         if (key_press === '+' || key_press === '-') {
            reckonAll();
            register[1] = '';
            register[2] = '';
            operator[0] = key_press;
            operator[1] = '';
            setScreenFlag(1);
            // buffer.screen_flag = 1;
         } else {
            operator[1] = key_press;
            setScreenFlag(2);
            // buffer.screen_flag = 2;
         }
         break;
      case 5:
         if (key_press === '+' || key_press === '-') {
            reckonAll();
            register[1] = '';
            register[2] = '';
            operator[0] = key_press;
            operator[1] = '';
            setScreenFlag(1);
            // buffer.screen_flag = 1;
         } else {
            register[1] = operate(register[1], operator[1], register[2]);
            register[2] = '';
            operator[1] = key_press;
            setScreenFlag(2);
            // buffer.screen_flag = 2;
         }
         break;
      case 6:
         break;
      default:
         console.log("something other than OPERATOR happened!");
         break;
    }
  }

  function flipSign() {
    switch (buffer.state) {
      case 1:
        if (register[0] !== 'empty' && register[0] !== '0') {
          register[0] = Number(register[0] * -1).toString();
          setScreenFlag(1);
          // buffer.screen_flag = 1;
        }
        break;
      case 2:
        register[1] = Number(register[0] * -1).toString();
        setScreenFlag(2);
        // buffer.screen_flag = 2;
        break;
      case 3:
        register[1] = Number(register[1] * -1).toString();
        setScreenFlag(2);
        // buffer.screen_flag = 2;
        break;
      case 4:
        register[2] = Number(register[1] * -1).toString();
        setScreenFlag(3);
        // buffer.screen_flag = 3;
        break;
      case 5:
        register[2] = Number(register[2] * -1).toString();
        setScreenFlag(3);
        // buffer.screen_flag = 3;
        break;
      case 6:
        break;
      default:
        console.log("something other than PLUS-MINUS happened!");
        break;
    }
  }

  function appendDecimal() {
    switch (buffer.state) {
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
         // buffer.screen_flag = 2;
         break;
      case 3:
         if (register[1].indexOf('.') === -1 && register[1].length < 10) {
            register[1] = register[1] + '.';
         }
         break;
      case 4:
         register[2] = '0.';
         setScreenFlag(3);
         // buffer.screen_flag = 3;
         break;
      case 5:
         if (register[2].indexOf('.') === -1 && register[2].length < 10) {
            register[2] = register[2] + '.';
         }
         break;
      case 6:
         break;
      default:
         console.log("something other than . happened!");
         break;
    }
  }

  function calculateSquareRoot() {
    switch (buffer.state) {
      case 1:
         if (register[0] > 0) {
            register[0] = trim(Math.sqrt(Number(register[0])).toString());
            setScreenFlag(1);
            // buffer.screen_flag = 1;
         } else if (register[0] === '' || register[0] === '0') {
            register[0] = '0';
            setScreenFlag(1);
            // buffer.screen_flag = 1;
         } else {
            register[0] = 'ERROR';
            register[1] = '';
            register[2] = '';
            operator[0] = '';
            operator[1] = '';
            setScreenFlag(1);
            // buffer.screen_flag = 1;
         }
         break;
      case 2:
         if (register[0] > 0) {
            register[1] = trim(Math.sqrt(Number(register[0])).toString());
            setScreenFlag(2);
            // buffer.screen_flag = 2;
         } else {
            register[0] = 'ERROR';
            register[1] = '';
            register[2] = '';
            operator[0] = '';
            operator[1] = '';
            setScreenFlag(1);
            // buffer.screen_flag = 1;
         }
         break;
      case 3:
         if (register[1] > 0) {
            register[1] = trim(Math.sqrt(Number(register[1])).toString());
            setScreenFlag(2);
            // buffer.screen_flag = 2;
         } else {
            register[0] = 'ERROR';
            register[1] = '';
            register[2] = '';
            operator[0] = '';
            operator[1] = '';
            setScreenFlag(1);
            // buffer.screen_flag = 1;
         }
         break;
      case 4:
         if (register[1] > 0) {
            register[2] = trim(Math.sqrt(Number(register[1])).toString());
            setScreenFlag(3);
            // buffer.screen_flag = 3;
         } else {
            register[0] = 'ERROR';
            register[1] = '';
            register[2] = '';
            operator[0] = '';
            operator[1] = '';
            setScreenFlag(1);
            // buffer.screen_flag = 1;
         }
         break;
      case 5:
         if (register[2] > 0) {
            register[2] = trim(Math.sqrt(Number(register[2])).toString());
            setScreenFlag(3);
            // buffer.screen_flag = 3;
         } else {
            register[0] = 'ERROR';
            register[1] = '';
            register[2] = '';
            operator[0] = '';
            operator[1] = '';
            setScreenFlag(1);
            // buffer.screen_flag = 1;
         }
         break;
      case 6:
         break;
      default:
         console.log("something other than root happened!");
         break;
    }
  }

  return {
    trim          : trim,
    operate       : operate,
    setState      : setState,
    clear         : clear,
    updateScreen  : updateScreen,
    setNumber     : setNumber,
    setOperator   : setOperator,
    buffer        : buffer,
    reckonInside  : reckonInside,
    reckonOutside : reckonOutside,
    reckonAll     : reckonAll,
    getKeyPress   : getKeyPress,
    setKeyPress   : setKeyPress,
    routeKeyPress : routeKeyPress,
    flipSign      : flipSign,
    appendDecimal : appendDecimal,
    calculateSquareRoot : calculateSquareRoot,
    sendKeyPress  : sendKeyPress,
    register      : register,
    operator      : operator,
    getScreenFlag : getScreenFlag,
    setScreenFlag : setScreenFlag
  };


};
