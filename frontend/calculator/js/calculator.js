(function() {
// var Calculator = function() {
  'use strict';

  let cowport = document.getElementById("cowport");
  let screen = document.getElementById('screen');
  cowport.innerHTML = "hello";
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
      67: 'c'
  }


  document.addEventListener('keyup', keyHandler, 0);

  function logBuffer() {
    let output = '';
    for (let property in buffer) {
      if ( buffer.hasOwnProperty(property) ) {
        output += buffer[property] + ' : ';
      }
    }
    return output;
  }

  function keyHandler(key) {
    if ( key.keyCode >= 48 && key.keyCode <= 57 ) {
      setNumber(key_map[key.keyCode]);
    } else
    if ( key.keyCode == 80 || key.keyCode == 77 || key.keyCode == 84 || key.keyCode == 68 ) {
      setOperator(key_map[key.keyCode]);
    } else
    if ( key.keyCode == 67 ) {
      clear();
    }
    setState();
    updateScreen();
    console.log(key.keyCode);
    cowport.innerHTML = logBuffer();
  }

  var buffer = {
    register_a  : 'empty',
    register_b  : 'empty',
    register_c  : 'empty',
    operator_a  : 'empty',
    operator_b  : 'empty',
    screen      : '0',
    screen_flag : 1, // 1 -> show register_a, 2 -> show register_b, 3 -> show register_c
    state       : 1
  };

  

  /**
   * Trim all values to 10 characters or less
   *
   * @params {string, number} A decimal number
   * @returns {string} A <10 character string
  */
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

  /**
   * perform a single operation
   *   pattern: A + B -> l o r
   *
   * @params {string} left of operator
   * @params {string} operator
   * @params {string} right of operator
   * @returns {string}
   */
  function operate(l, o, r) {
     l = Number(l);
     r = Number(r);
     if (o === '+') {
        return trim((l + r).toString());
     }
     if (o === '-') {
        return trim((l - r).toString());
     }
     if (o === '*') {
        return trim((l * r).toString());
     }
     if (o === '/') {
        if (r === 0) {
           return 'DIV BY 0';
        }
        return trim((l / r).toString());
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
      } else if (buffer.operator_a === 'empty') {
        buffer.state = 1;
      } else if (buffer.operator_a !== 'empty' && buffer.register_b === 'empty') {
        buffer.state = 2;
      } else if (buffer.operator_a !== 'empty' && buffer.register_a !== 'empty' && buffer.operator_b === 'empty') {
        buffer.state = 3;
      } else if (buffer.operator_b !== 'empty' && buffer.register_c === 'empty') {
        buffer.state = 4;
      } else if (buffer.operator_b !== 'empty' && buffer.register_c !== 'empty') {
        buffer.state = 5;
      }
  }

  /**
   * updates the screen element
   *
   * @params {object} the screen element
  */
  function updateScreen() {
    if (buffer.screen_flag === 1) {
       if (buffer.register_a === 'empty') {
          // this.screen = '0';
          screen.innerHTML = '0';
       } else {
          // this.screen = this.regA;
          screen.innerHTML = buffer.register_a.toString();
       }
    }
    if (buffer.screen_flag === 2) {
       // this.screen = this.regB;
       screen.innerHTML = buffer.register_b.toString();
    }
    if (buffer.screen_flag === 3) {
       // this.screen = this.regC;
       screen.innerHTML = buffer.register_c.toString();
    }
  }

  /**
   * clear the buffer
   *
   * @params {object} The whole buffer object
   */
  function clear() {
     buffer.screen_flag = 1;
     buffer.register_a = 'empty';
     buffer.register_b = 'empty';
     buffer.register_c = 'empty';
     buffer.operator_a = 'empty';
     buffer.operator_b = 'empty';
     setState();
  }

  function setNumber(number) {
    switch(buffer.state) {
      case 1:
        buffer.screen_flag = 1;
        if (buffer.register_a === 'empty' || buffer.register_a === '0') {
          buffer.register_a = number.toString();
        } else if (buffer.register_a.toString().length < 10) {
          buffer.register_a = buffer.register_a.toString() + number;
        }
        break;
      case 2:
        buffer.screen_flag = 2;
        if (buffer.register_b === 'empty' || buffer.register_b === '0') {
          buffer.register_b = number.toString();
        } else if (buffer.register_b.toString().length < 10) {
          buffer.register_b = buffer.register_b.toString() + number;
        }
        break;
      case 3:
        if (buffer.register_b === 'empty' || buffer.register_b === '0') {
          buffer.register_b = number.toString();
        } else if (buffer.register_b.toString().length < 10) {
          buffer.register_b = buffer.register_b.toString() + number;
        }
        buffer.screen_flag = 2;
        break;
      case 4:
         buffer.register_c = number.toString();
         buffer.screen_flag = 3;
         break;
      case 5:
         if (buffer.register_c.toString().length < 10) {
            buffer.register_c = buffer.register_c.toString() + number;
            buffer.screen_flag = 3;
         }
         break;
      case 6:
         break;
      default:
         console.log("something other than NUMBER happened!");
         break;
    }
    setState();
  }

  function setOperator(operator) {
    switch (buffer.state) {
      case 1:
         buffer.operator_a = operator;
         buffer.screen_flag = 1;
         break;
      case 2:
         buffer.operator_a = operator;
         buffer.screen_flag = 1;
         break;
      case 3:
         if ((buffer.operator_a === '+' || buffer.operator_a === '-') && (operator === '*' || operator === '/')) {
            buffer.operator_b = operator;
            buffer.screen_flag = 2;
         } else {
            buffer.register_a = operate(buffer.register_a, buffer.operator_a, buffer.register_b);
            buffer.register_b = 'empty';
            buffer.operator_a = operator;
            buffer.screen_flag = 1;
         }
         break;
      case 4:
         if (operator === '+' || operator === '-') {
            buffer.register_a = operate(buffer.register_a, buffer.operator_a,
               operate(buffer.register_b, buffer.operator_b, buffer.register_b));
            buffer.register_b = 'empty';
            buffer.register_c = 'empty';
            buffer.operator_a = operator;
            buffer.operator_b = 'empty';
            buffer.screen_flag = 1;
         } else {
            buffer.operator_b = operator;
            buffer.screen_flag = 2;
         }
         break;
      case 5:
         if (operator === '+' || operator === '-') {
            buffer.register_a = operate(buffer.register_a, buffer.operator_a,
               operate(buffer.register_b, buffer.operator_b, buffer.register_c));
            buffer.register_b = 'empty';
            buffer.register_c = 'empty';
            buffer.operator_a = operator;
            buffer.operator_b = 'empty';
            buffer.screen_flag = 1;
         } else {
            buffer.register_b = operate(buffer.register_b, buffer.operator_b, buffer.register_c);
            buffer.register_c = 'empty';
            buffer.operator_b = operator;
            buffer.screen_flag = 2;
         }
         break;
      case 6:
         break;
      default:
         console.log("something other than OPERATOR happened!");
         break;
    }
    setState();
  }

  // +/-
  // .
  // square root
  // =
  // update screen
  
  return {
    trim        : trim,
    operate     : operate,
    setState    : setState,
    clear       : clear,
    updateScreen : updateScreen,
    setNumber : setNumber,
    setOperator : setOperator,
    buffer       : buffer
  };


}());
