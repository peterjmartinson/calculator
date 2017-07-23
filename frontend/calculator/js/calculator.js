// to do:
// be strict about string vs. number, instead of using toString everywhere
// replace 'empty' with ''
// Make two operate functions:
//   operatePartial = <register_b> <operator_b> <register_c> -> <register_b>
//   operateFinal   = <register_a> <operator_a> <register_b> -> <register_a>
// or something like that.  point being, you want to just call a function, not come up with logic
// (function() {
var Calculator = function() {
  'use strict';

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
      67: 'c'
  }


  let Entry = '';

  function getEntry() {
    return Entry;
  }

  function setEntry(new_Entry) {
    Entry = new_Entry.toString();
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
    setEntry(key_map[key.keyCode]);
    if ( key.keyCode >= 48 && key.keyCode <= 57 ) {
      setNumber();
    } else
    if ( key.keyCode == 80 || key.keyCode == 77 || key.keyCode == 84 || key.keyCode == 68 ) {
      setOperator();
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
    if (buffer.register_c === 'empty') {
      buffer.register_c = buffer.register_b
    }
    let result = operate(buffer.register_b, buffer.operator_b, buffer.register_c);
    buffer.register_b = result.toString();
    buffer.screen_flag = 2;
  }

  function reckonOutside() {
    if (buffer.register_b === 'empty') {
      buffer.register_b = buffer.register_a
    }
    let result = operate(buffer.register_a, buffer.operator_a, buffer.register_b);
    buffer.register_a = result.toString();
  }

  function equal() {
    if (buffer.register_b != 'empty' && buffer.register_c != 'empty' && buffer.operator_b != 'empty') {
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

  function updateScreen() {
    if (buffer.screen_flag === 1) {
       if (buffer.register_a === 'empty') {
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
     buffer.screen_flag = 1;
     buffer.register_a = 'empty';
     buffer.register_b = 'empty';
     buffer.register_c = 'empty';
     buffer.operator_a = 'empty';
     buffer.operator_b = 'empty';
     setState();
  }

  function setNumber() {
    switch(buffer.state) {
      case 1:
        buffer.screen_flag = 1;
        if (buffer.register_a === 'empty' || buffer.register_a === '0') {
          buffer.register_a = getEntry();
        } else if (buffer.register_a.length < 10) {
          buffer.register_a = buffer.register_a + getEntry();
        }
        break;
      case 2:
        buffer.screen_flag = 2;
        if (buffer.register_b === 'empty' || buffer.register_b === '0') {
          buffer.register_b = getEntry();
        } else if (buffer.register_b.length < 10) {
          buffer.register_b = buffer.register_b + getEntry();
        }
        break;
      case 3:
        if (buffer.register_b === 'empty' || buffer.register_b === '0') {
          buffer.register_b = getEntry();
        } else if (buffer.register_b.length < 10) {
          buffer.register_b = buffer.register_b + getEntry();
        }
        buffer.screen_flag = 2;
        break;
      case 4:
         buffer.register_c = getEntry();
         buffer.screen_flag = 3;
         break;
      case 5:
         if (buffer.register_c.length < 10) {
            buffer.register_c = buffer.register_c + getEntry();
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
         buffer.operator_a = getEntry();
         buffer.screen_flag = 1;
         break;
      case 2:
         buffer.operator_a = getEntry();
         buffer.screen_flag = 1;
         break;
      case 3:
         if ((buffer.operator_a === '+' || buffer.operator_a === '-') && (getEntry() === '*' || getEntry() === '/')) {
            buffer.operator_b = getEntry();
            buffer.screen_flag = 2;
         } else {
            buffer.register_a = operate(buffer.register_a, buffer.operator_a, buffer.register_b);
            buffer.register_b = 'empty';
            buffer.operator_a = getEntry();
            buffer.screen_flag = 1;
         }
         break;
      case 4:
         if (getEntry() === '+' || getEntry() === '-') {
            buffer.register_a = operate(buffer.register_a, buffer.operator_a,
               operate(buffer.register_b, buffer.operator_b, buffer.register_b));
            buffer.register_b = 'empty';
            buffer.register_c = 'empty';
            buffer.operator_a = getEntry();
            buffer.operator_b = 'empty';
            buffer.screen_flag = 1;
         } else {
            buffer.operator_b = getEntry();
            buffer.screen_flag = 2;
         }
         break;
      case 5:
         if (getEntry() === '+' || getEntry() === '-') {
            buffer.register_a = operate(buffer.register_a, buffer.operator_a,
               operate(buffer.register_b, buffer.operator_b, buffer.register_c));
            buffer.register_b = 'empty';
            buffer.register_c = 'empty';
            buffer.operator_a = getEntry();
            buffer.operator_b = 'empty';
            buffer.screen_flag = 1;
         } else {
            buffer.register_b = operate(buffer.register_b, buffer.operator_b, buffer.register_c);
            buffer.register_c = 'empty';
            buffer.operator_b = getEntry();
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

  // +/-
  // .
  // square root
  // =
  
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
    equal         : equal,
    getEntry      : getEntry,
    setEntry      : setEntry
  };


};
// }());
