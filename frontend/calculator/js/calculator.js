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

  // TRIM ALL VALUES TO 10 CHARACTERS OR LESS
  function trim(num) {
     var numLen, truncLen, tempVal;

     numLen = num.toString().length;
     truncLen = (Math.trunc(Number(num))).toString().length;
     if (numLen === truncLen && numLen > 10) {
        num = 'ERROR';
     } else if (numLen > truncLen) {
        tempVal = (Math.round(Number(num) * Math.pow(10, (10 - truncLen)))) / Math.pow(10, (10 - truncLen));
        num = tempVal.toString();
     }
     return num.toString();
  }

}());
