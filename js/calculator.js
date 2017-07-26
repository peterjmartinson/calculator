var Calculator = function() {
  'use strict';

  let buffer = {
    register_a  : '',
    register_b  : '',
    register_c  : '',
    operator_a  : '',
    operator_b  : '',
    screen      : '0',
    screen_flag : 1, // 1 -> show register_a, 2 -> show register_b, 3 -> show register_c
    state       : 1
  };

  let cowport = document.getElementById("cowport");
  let screen = document.getElementById("screen");

  const key_map = {
      187: '=',
      80: '+',
      77: '-',
      84: '*',
      68: '/',
      48: '0',
      49: '1',
      50: '2',
      51: '3',
      52: '4',
      53: '5',
      54: '6',
      55: '7',
      56: '8',
      57: '9',
      67: 'clear'
  }

  let KeyPress = '';

  function getKeyPress() {
    return KeyPress;
  }

  function setKeyPress(new_keypress) {
    KeyPress = new_keypress.toString();
  }

  document.addEventListener('keyup', keyHandler, 0);

  function logBuffer() {
    let output = '';
    for (let property in buffer) {
      if ( buffer.hasOwnProperty(property) ) {
        output += buffer[property] + ', ';
      }
    }
    return output;
  }

  function keyHandler(key) {
    sendKeyPress(key_map[key.keyCode]);
  }

  function sendKeyPress(key) {
    setKeyPress(key);
    routeKeyPress();
  }

  function routeKeyPress() {
    console.log(KeyPress);
    let number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        operator = ['+', '-', '*', '/'];
    if ( number.indexOf(KeyPress) > -1 ) {
      setNumber();
    }
    else if ( operator.indexOf(KeyPress) > -1 ) {
      setOperator();
    }
    else if ( KeyPress === '=' ) { 
      reckonAll();
    }
    else if ( KeyPress === 'pm' ) {
      flipSign();
    }
    else if ( KeyPress === '.' ) {
      appendDecimal();
    }
    else if ( KeyPress === 'root' ) {
      calculateSquareRoot();
    }
    else if ( KeyPress === 'clear' ) {
      clear();
    }
    setState();
    updateScreen();
    // console.log(KeyPress);
    cowport.innerHTML = logBuffer();
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
    if (buffer.register_c === '') {
      buffer.register_c = buffer.register_b
    }
    let result = operate(buffer.register_b, buffer.operator_b, buffer.register_c);
    buffer.register_b = result.toString();
    buffer.screen_flag = 2;
  }

  function reckonOutside() {
    if (buffer.register_b === '') {
      buffer.register_b = buffer.register_a
    }
    let result = operate(buffer.register_a, buffer.operator_a, buffer.register_b);
    buffer.register_a = result.toString();
    buffer.screen_flag = 1;
  }

  function reckonAll() {
    if (buffer.register_b != '' && buffer.register_c != '' && buffer.operator_b != '') {
      reckonInside();
      reckonOutside();
    } else {
      reckonOutside();
    }
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
      if (buffer.register_a === 'DIV BY 0' || buffer.register_b === 'DIV BY 0') {
        buffer.state = 6;
      } else if (buffer.register_a === 'ERROR' || buffer.register_b === 'ERROR') {
        buffer.state = 6;
      } else if (buffer.operator_a === '') {
        buffer.state = 1;
      } else if (buffer.operator_a !== '' && buffer.register_b === '') {
        buffer.state = 2;
      } else if (buffer.operator_a !== '' && buffer.register_a !== '' && buffer.operator_b === '') {
        buffer.state = 3;
      } else if (buffer.operator_b !== '' && buffer.register_c === '') {
        buffer.state = 4;
      } else if (buffer.operator_b !== '' && buffer.register_c !== '') {
        buffer.state = 5;
      }
  }

  function updateScreen() {
    if (buffer.screen_flag === 1) {
       if (buffer.register_a === '') {
          screen.innerHTML = '0';
       } else {
          screen.innerHTML = buffer.register_a;
       }
    }
    if (buffer.screen_flag === 2) {
       screen.innerHTML = buffer.register_b;
    }
    if (buffer.screen_flag === 3) {
       screen.innerHTML = buffer.register_c;
    }
  }

  function clear() {
     buffer.register_a = '';
     buffer.register_b = '';
     buffer.register_c = '';
     buffer.operator_a = '';
     buffer.operator_b = '';
     buffer.screen     = '0';
     buffer.screen_flag = 1;
     setState();
  }

  function setNumber() {
    switch(buffer.state) {
      case 1:
        buffer.screen_flag = 1;
        if (buffer.register_a === '' || buffer.register_a === '0') {
          buffer.register_a = getKeyPress();
        } else if (buffer.register_a.length < 10) {
          buffer.register_a = buffer.register_a + getKeyPress();
        }
        break;
      case 2:
        buffer.screen_flag = 2;
        if (buffer.register_b === '' || buffer.register_b === '0') {
          buffer.register_b = getKeyPress();
        } else if (buffer.register_b.length < 10) {
          buffer.register_b = buffer.register_b + getKeyPress();
        }
        break;
      case 3:
        if (buffer.register_b === '' || buffer.register_b === '0') {
          buffer.register_b = getKeyPress();
        } else if (buffer.register_b.length < 10) {
          buffer.register_b = buffer.register_b + getKeyPress();
        }
        buffer.screen_flag = 2;
        break;
      case 4:
         buffer.register_c = getKeyPress();
         buffer.screen_flag = 3;
         break;
      case 5:
         if (buffer.register_c.length < 10) {
            buffer.register_c = buffer.register_c + getKeyPress();
            buffer.screen_flag = 3;
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
    switch (buffer.state) {
      case 1:
         buffer.operator_a = getKeyPress();
         buffer.screen_flag = 1;
         break;
      case 2:
         buffer.operator_a = getKeyPress();
         buffer.screen_flag = 1;
         break;
      case 3:
         if ((buffer.operator_a === '+' || buffer.operator_a === '-') && (getKeyPress() === '*' || getKeyPress() === '/')) {
            buffer.operator_b = getKeyPress();
            buffer.screen_flag = 2;
         } else {
            buffer.register_a = operate(buffer.register_a, buffer.operator_a, buffer.register_b);
            buffer.register_b = '';
            buffer.operator_a = getKeyPress();
            buffer.screen_flag = 1;
         }
         break;
      case 4:
         if (getKeyPress() === '+' || getKeyPress() === '-') {
            buffer.register_a = operate(buffer.register_a, buffer.operator_a,
               operate(buffer.register_b, buffer.operator_b, buffer.register_b));
            buffer.register_b = '';
            buffer.register_c = '';
            buffer.operator_a = getKeyPress();
            buffer.operator_b = '';
            buffer.screen_flag = 1;
         } else {
            buffer.operator_b = getKeyPress();
            buffer.screen_flag = 2;
         }
         break;
      case 5:
         if (getKeyPress() === '+' || getKeyPress() === '-') {
            buffer.register_a = operate(buffer.register_a, buffer.operator_a,
               operate(buffer.register_b, buffer.operator_b, buffer.register_c));
            buffer.register_b = '';
            buffer.register_c = '';
            buffer.operator_a = getKeyPress();
            buffer.operator_b = '';
            buffer.screen_flag = 1;
         } else {
            buffer.register_b = operate(buffer.register_b, buffer.operator_b, buffer.register_c);
            buffer.register_c = '';
            buffer.operator_b = getKeyPress();
            buffer.screen_flag = 2;
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
        if (buffer.register_a !== 'empty' && buffer.register_a !== '0') {
          buffer.register_a = Number(buffer.register_a * -1).toString();
          buffer.screen_flag = 1;
        }
        break;
      case 2:
        buffer.register_b = Number(buffer.register_a * -1).toString();
        buffer.screen_flag = 2;
        break;
      case 3:
        buffer.register_b = Number(buffer.register_b * -1).toString();
        buffer.screen_flag = 2;
        break;
      case 4:
        buffer.register_c = Number(buffer.register_b * -1).toString();
        buffer.screen_flag = 3;
        break;
      case 5:
        buffer.register_c = Number(buffer.register_c * -1).toString();
        buffer.screen_flag = 3;
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
         if (buffer.register_a.indexOf('.') === -1 && buffer.register_a.length < 10) {
            if (buffer.register_a === '' || buffer.register_a === '0') {
               buffer.register_a = '0.';
            } else {
               buffer.register_a = buffer.register_a + '.';
            }
         }
         break;
      case 2:
         buffer.register_b = '0.';
         buffer.screen_flag = 2;
         break;
      case 3:
         if (buffer.register_b.indexOf('.') === -1 && buffer.register_b.length < 10) {
            buffer.register_b = buffer.register_b + '.';
         }
         break;
      case 4:
         buffer.register_c = '0.';
         buffer.screen_flag = 3;
         break;
      case 5:
         if (buffer.register_c.indexOf('.') === -1 && buffer.register_c.length < 10) {
            buffer.register_c = buffer.register_c + '.';
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
         if (buffer.register_a > 0) {
            buffer.register_a = trim(Math.sqrt(Number(buffer.register_a)).toString());
            buffer.screen_flag = 1;
         } else if (buffer.register_a === '' || buffer.register_a === '0') {
            buffer.register_a = '0';
            buffer.screen_flag = 1;
         } else {
            buffer.register_a = 'ERROR';
            buffer.register_b = '';
            buffer.register_c = '';
            buffer.opA = '';
            buffer.opB = '';
            buffer.screen_flag = 1;
         }
         break;
      case 2:
         if (buffer.register_a > 0) {
            buffer.register_b = trim(Math.sqrt(Number(buffer.register_a)).toString());
            buffer.screen_flag = 2;
         } else {
            buffer.register_a = 'ERROR';
            buffer.register_b = '';
            buffer.register_c = '';
            buffer.opA = '';
            buffer.opB = '';
            buffer.screen_flag = 1;
         }
         break;
      case 3:
         if (buffer.register_b > 0) {
            buffer.register_b = trim(Math.sqrt(Number(buffer.register_b)).toString());
            buffer.screen_flag = 2;
         } else {
            buffer.register_a = 'ERROR';
            buffer.register_b = '';
            buffer.register_c = '';
            buffer.opA = '';
            buffer.opB = '';
            buffer.screen_flag = 1;
         }
         break;
      case 4:
         if (buffer.register_b > 0) {
            buffer.register_c = trim(Math.sqrt(Number(buffer.register_b)).toString());
            buffer.screen_flag = 3;
         } else {
            buffer.register_a = 'ERROR';
            buffer.register_b = '';
            buffer.register_c = '';
            buffer.opA = '';
            buffer.opB = '';
            buffer.screen_flag = 1;
         }
         break;
      case 5:
         if (buffer.register_c > 0) {
            buffer.register_c = trim(Math.sqrt(Number(buffer.register_c)).toString());
            buffer.screen_flag = 3;
         } else {
            buffer.register_a = 'ERROR';
            buffer.register_b = '';
            buffer.register_c = '';
            buffer.opA = '';
            buffer.opB = '';
            buffer.screen_flag = 1;
         }
         break;
      case 6:
         break;
      default:
         console.log("something other than . happened!");
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
    sendKeyPress  : sendKeyPress
  };


};
