(function() {
  'use strict';

  var calcState = {
    regA       : 'empty',
    regB       : 'empty',
    regC       : 'empty',
    opA        : 'empty',
    opB        : 'empty',
    screenFlag : 1, // 1 -> show regA, 2 -> show regB, 3 -> show regC
    screen     : '0',
  };

  /**
   * Trim all values to 10 characters or less
   *
   * @params {string, number} A decimal number
   * @returns {string} A <10 character string
  */
  function trim(num) {
     console.log(num);
     var numLen, truncLen, tempVal;
     numLen = num.toString().length;
     truncLen = (Math.trunc(Number(num))).toString().length;
     if (numLen === truncLen && numLen > 10) {
        num = 'ERROR';
     } else if (numLen > truncLen) {
        tempVal = (Math.round(Number(num) * Math.pow(10, (9 - truncLen)))) / Math.pow(10, (9 - truncLen));
        num = tempVal.toString();
     }
     console.log(num);
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

  window.trim = trim;
  window.operate = operate;
  window.calState = calState;
}());
