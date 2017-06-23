var Calculator = function() {
  'use strict';

  var buffer = {
    register_a       : 'empty',
    register_b       : 'empty',
    register_c       : 'empty',
    operator_a        : 'empty',
    operator_b        : 'empty',
    screen_flag : 1, // 1 -> show register_a, 2 -> show register_b, 3 -> show register_c
    screen     : '0',
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

  // DETERMINE CALCULATOR STATE
  function calState(A, B, C, oA, oB) {
     if (A === 'DIV BY 0' || B === 'DIV BY 0') {
        return 6;
     }
     if (A === 'ERROR' || B === 'ERROR') {
        return 6;
     } else if (oA === 'empty') {
        return 1;
     } else if (oA !== 'empty' && B === 'empty') {
        return 2;
     } else if (oA !== 'empty' && A !== 'empty' && oB === 'empty') {
        return 3;
     } else if (oB !== 'empty' && C === 'empty') {
        return 4;
     } else if (oB !== 'empty' && C !== 'empty') {
        return 5;
     }
  }

  function clearBuffer(buffer) {
    buffer.screen_flag = 1;
    buffer.register_a       = 'empty';
    buffer.register_b       = 'empty';
    buffer.register_c       = 'empty';
    buffer.operator_a        = 'empty';
    buffer.operator_b        = 'empty';
  }

  function updateScreen(buffer) {
    var screen_html = document.getElementById('screen');
    if (buffer.screen_flag === 1) {
       if (buffer.register_a === 'empty') {
          // this.screen = '0';
          screen_html.innerHTML = '0';
       } else {
          // this.screen = this.regA;
          screen_html.innerHTML = buffer.register_a.toString();
       }
    }
    if (buffer.screen_flag === 2) {
       // this.screen = this.regB;
       screen_html.innerHTML = buffer.register_b.toString();
    }
    if (buffer.screen_flag === 3) {
       // this.screen = this.regC;
       screen_html.innerHTML = buffer.register_c.toString();
    }
  }

  /*
   * CLEAR THE BUFFER
   */
  function clear(buffer) {
  // if (b === 'C') {
     buffer.screen_flag = 1;
     buffer.register_a = 'empty';
     buffer.register_b = 'empty';
     buffer.register_c = 'empty';
     buffer.operator_a = 'empty';
     buffer.operator_b = 'empty';
  }

  return {
    trim        : trim,
    operate     : operate,
    calState    : calState,
    clearBuffer : clearBuffer,
    updateScreen : updateScreen
  };


};
