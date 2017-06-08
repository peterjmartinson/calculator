// init main object; we'll return this later
var calcObj = {};

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

/*
 * PERFORM A SINGLE OPERATION
 * @param l string
 * @param o string
 * @param r string
 * pattern: A + B -> l o r
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

calcObj.inBuffer = {
   regA: 'empty',
   regB: 'empty',
   regC: 'empty',
   opA: 'empty',
   opB: 'empty',
   screenFlag: 1, // 1 -> show regA, 2 -> show regB, 3 -> show regC
   screen: '0',

   updateBuffer: function(b) {

      /*
       * CLEAR THE BUFFER
       */
      if (b === 'C') {
         this.screenFlag = 1;
         this.regA = 'empty';
         this.regB = 'empty';
         this.regC = 'empty';
         this.opA = 'empty';
         this.opB = 'empty';
      }

      /*
       * ENTER A NUMBER
       *
       *          A | B | C |opA|opB|
       *         ---|---|---|---|---|
       * Case 1) 0,A|   |   |   |   | (regA=0) replace regA, (regA=N,<10char) append to regA
       * Case 2)  A |   |   | + |   | Replace regB
       * Case 3)  A | B |   |+,*|   | (regB<10char) Append to regB
       * Case 4)  A | B |   | + | * | Replace regC
       * Case 5)  A | B | C | + | * | (regC<10char) Append to regC
       */
      if (typeof b === 'number') {
         switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
            case 1:
               if (this.regA === 'empty' || this.regA === '0') {
                  this.regA = b.toString();
                  this.screenFlag = 1;
               } else if (this.regA.toString().length < 10) {
                  this.regA = this.regA.toString() + b;
                  this.screenFlag = 1;
               }
               break;
            case 2:
               this.regB = b.toString();
               this.screenFlag = 2;
               break;
            case 3:
               if (this.regB.toString().length < 10) {
                  this.regB = this.regB.toString() + b;
                  this.screenFlag = 2;
               }
               break;
            case 4:
               this.regC = b.toString();
               this.screenFlag = 3;
               break;
            case 5:
               if (this.regC.toString().length < 10) {
                  this.regC = this.regC.toString() + b;
                  this.screenFlag = 3;
               }
               break;
            case 6:
               break;
            default:
               console.log("something other than NUMBER happened!");
               break;
         }
      }

      /*
       * ENTER AN OPERATOR
       *
       *          A | B | C |opA|opB|
       *         ---|---|---|---|---|
       * Case 1) 0,A|   |   |   |   | -> opA
       * Case 2)  A |   |   | + |   | -> opA
       * Case 3)  A | B |   |+,*|   | (opA=+,* b=+) operate & b->opA; (aO=+ b=*) b->opB
       * Case 4)  A | B |   | + | * | (b=*) b->opB; (b=+) B->regC, op(A,opA,op(B,opB,C))
       * Case 5)  A | B | C | + | * | (b=*) B=op(B,opB,C), b->opB; (b=+), op(A,opA,op(B,opB,C))
       */
      // ======================= enter an operator
      if (b === '+' || b === '-' || b === '*' || b === '/') {
         switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
            case 1:
               this.opA = b;
               this.screenFlag = 1;
               break;
            case 2:
               this.opA = b;
               this.screenFlag = 1;
               break;
            case 3:
               if ((this.opA === '+' || this.opA === '-') && (b === '*' || b === '/')) {
                  this.opB = b;
                  this.screenFlag = 2;
               } else {
                  this.regA = operate(this.regA, this.opA, this.regB);
                  this.opA = b;
                  this.screenFlag = 1;
               }
               break;
            case 4:
               if (b === '+' || b === '-') {
                  this.regB = operate(this.regA, this.opA,
                     operate(this.regB, this.opB, this.regB));
                  this.regA = 'empty';
                  this.regC = 'empty';
                  this.opB = 'empty';
                  this.opA = b;
                  this.screenFlag = 1;
               } else {
                  this.opB = b;
                  this.screenFlag = 2;
               }
               break;
            case 5:
               if (b === '+' || b === '-') {
                  this.regB = operate(this.regA, this.opA,
                     operate(this.regB, this.opB, this.regC));
                  this.regA = 'empty';
                  this.regC = 'empty';
                  this.opB = 'empty';
                  this.opA = b;
                  this.screenFlag = 1;
               } else {
                  this.regB = operate(this.regB, this.opB, this.regC);
                  this.regC = 'empty';
                  this.opB = b;
                  this.screenFlag = 2;
               }
               break;
            case 6:
               break;
            default:
               console.log("something other than OPERATOR happened!");
               break;
         }
      }

      /*
       * ENTER +/-
       *
       *          A | B | C |opA|opB|
       *         ---|---|---|---|---|
       * Case 1) 0,A|   |   |   |   | 
       * Case 2)  A |   |   | + |   | 
       * Case 3)  A | B |   |+,*|   | 
       * Case 4)  A | B |   | + | * | 
       * Case 5)  A | B | C | + | * | 
       */
      if (b === 'pm') {
         switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
            case 1:
               if (this.regA !== 'empty' && this.regA !== '0') {
                  this.regA = Number(this.regA * -1).toString();
                  this.screenFlag = 1;
               }
               break;
            case 2:
               this.regB = Number(this.regA * -1).toString();
               this.screenFlag = 2;
               break;
            case 3:
               this.regB = Number(this.regB * -1).toString();
               this.screenFlag = 2;
               break;
            case 4:
               this.regC = Number(this.regB * -1).toString();
               this.screenFlag = 3;
               break;
            case 5:
               this.regC = Number(this.regC * -1).toString();
               this.screenFlag = 3;
               break;
            case 6:
               break;
            default:
               console.log("something other than PLUS-MINUS happened!");
               break;
         }
      }

      /*
       * ENTER .
       *
       *          A | B | C |opA|opB|
       *         ---|---|---|---|---|
       * Case 1) 0,A|   |   |   |   | if 0/null, 0.->A; if length<10, A+='.'
       * Case 2)  A |   |   | + |   | 0.->B, screenFlag=2 
       * Case 3)  A | B |   |+,*|   | if length<10, B+='.'
       * Case 4)  A | B |   | + | * | 0.->C, screenFlag=3
       * Case 5)  A | B | C | + | * | if length<10, C+='.'
       */
      if (b === '.') {
         switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
            case 1:
               if (this.regA.indexOf('.') === -1 && this.regA.length < 10) {
                  if (this.regA === 'empty' || this.regA === '0') {
                     this.regA = '0.';
                  } else {
                     this.regA = this.regA.toString() + '.';
                  }
               }
               break;
            case 2:
               this.regB = '0.';
               this.screenFlag = 2;
               break;
            case 3:
               if (this.regB.indexOf('.') === -1 && this.regB.length < 10) {
                  this.regB = this.regB.toString() + '.';
               }
               break;
            case 4:
               this.regC = '0.';
               this.screenFlag = 3;
               break;
            case 5:
               if (this.regC.indexOf('.') === -1 && this.regC.length < 10) {
                  this.regC = this.regC.toString() + '.';
               }
               break;
            case 6:
               break;
            default:
               console.log("something other than . happened!");
               break;
         }
      }

      /*
       * ENTER SQUARE ROOT
       *
       *          A | B | C |opA|opB|
       *         ---|---|---|---|---|
       * Case 1) 0,A|   |   |   |   | if A>0, sqrt(A)->A, else ERROR
       * Case 2)  A |   |   | + |   | if A>0, sqrt(A)->B, else ERROR
       * Case 3)  A | B |   |+,*|   | if B>0, sqrt(B)->B, else ERROR
       * Case 4)  A | B |   | + | * | if B>0, sqrt(B)->C, else ERROR
       * Case 5)  A | B | C | + | * | if C>0, sqrt(C)->C, else ERROR
       */
      // enter square-root
      if (b === 'root') {
         switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
            case 1:
               if (this.regA > 0) {
                  this.regA = trim(Math.sqrt(Number(this.regA)).toString());
                  this.screenFlag = 1;
               } else if (this.regA === 'empty' || this.regA === '0') {
                  this.regA = '0';
                  this.screenFlag = 1;
               } else {
                  this.regA = 'ERROR';
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
                  this.screenFlag = 1;
               }
               break;
            case 2:
               if (this.regA > 0) {
                  this.regB = trim(Math.sqrt(Number(this.regA)).toString());
                  this.screenFlag = 2;
               } else {
                  this.regA = 'ERROR';
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
                  this.screenFlag = 1;
               }
               break;
            case 3:
               if (this.regB > 0) {
                  this.regB = trim(Math.sqrt(Number(this.regB)).toString());
                  this.screenFlag = 2;
               } else {
                  this.regA = 'ERROR';
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
                  this.screenFlag = 1;
               }
               break;
            case 4:
               if (this.regB > 0) {
                  this.regC = trim(Math.sqrt(Number(this.regB)).toString());
                  this.screenFlag = 3;
               } else {
                  this.regA = 'ERROR';
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
                  this.screenFlag = 1;
               }
               break;
            case 5:
               if (this.regC > 0) {
                  this.regC = trim(Math.sqrt(Number(this.regC)).toString());
                  this.screenFlag = 3;
               } else {
                  this.regA = 'ERROR';
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
                  this.screenFlag = 1;
               }
               break;
            case 6:
               break;
            default:
               console.log("something other than . happened!");
               break;
         }
      }

      /*
       * ENTER =
       *
       *          A | B | C |opA|opB|
       *         ---|---|---|---|---|
       * Case 1) 0,A|   |   |   |   | do nothing!
       * Case 2)  A |   |   | + |   | B->A, operate
       * Case 3)  A | B |   |+,*|   | operate
       * Case 4)  A | B |   | + | * | C->B, operate(operate)
       * Case 5)  A | B | C | + | * | operate(operate)
       */
      if (b === '=') {
         this.screenFlag = 1;
         switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
            case 1:
               break;
            case 2:
               this.regA = operate(this.regA, this.opA, this.regA);
               if (this.regA === 'DIV BY 0') {
                  this.regA = 'DIV BY 0';
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
                  this.screenFlag = 1;
               } else {
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
               }
               break;
            case 3:
               this.regA = operate(this.regA, this.opA, this.regB);
               if (this.regA === 'DIV BY 0') {
                  this.regA = 'DIV BY 0';
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
                  this.screenFlag = 1;
               } else {
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
               }
               break;
            case 4:
               this.regA = operate(this.regA, this.opA,
                  operate(this.regB, this.opB, this.regB));
               if (this.regA === 'DIV BY 0') {
                  this.regA = 'DIV BY 0';
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
                  this.screenFlag = 1;
               } else {
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
               }
               break;
            case 5:
               this.regA = operate(this.regA, this.opA,
                  operate(this.regB, this.opB, this.regC));
               if (this.regA === 'DIV BY 0') {
                  this.regA = 'DIV BY 0';
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
                  this.screenFlag = 1;
               } else {
                  this.regB = 'empty';
                  this.regC = 'empty';
                  this.opA = 'empty';
                  this.opB = 'empty';
               }
               break;
            case 6:
               break;
            default:
               console.log("something other than . happened!");
               break;
         }
      }

      // update the screen
      if (this.screenFlag === 1) {
         if (this.regA === 'empty') {
            // this.screen = '0';
            document.getElementById('screen').innerHTML = '0';
         } else {
            // this.screen = this.regA;
            document.getElementById('screen').innerHTML = this.regA.toString();
         }
      }
      if (this.screenFlag === 2) {
         // this.screen = this.regB;
         document.getElementById('screen').innerHTML = this.regB.toString();
      }
      if (this.screenFlag === 3) {
         // this.screen = this.regC;
         document.getElementById('screen').innerHTML = this.regC.toString();
      }

      //        return {
      //            regA: this.regA,
      //            regB: this.regB,
      //            regC: this.regC,
      //            opA: this.opA,
      //            opB: this.opB,
      //            screen: this.screen
      //        };
   }
};

// need a whole bunch of click handlers
document.getElementById('clear').onclick = calcObj.inBuffer.updateBuffer('C');
document.getElementById('plus-minus').onclick = calcObj.inBuffer.updateBuffer('pm');
document.getElementById('root').onclick = calcObj.inBuffer.updateBuffer('root');
document.getElementById('divide').onclick = calcObj.inBuffer.updateBuffer('/');
document.getElementById('seven').onclick = calcObj.inBuffer.updateBuffer('7');
document.getElementById('eight').onclick = calcObj.inBuffer.updateBuffer('8');
document.getElementById('nine').onclick = calcObj.inBuffer.updateBuffer('9');
document.getElementById('times').onclick = calcObj.inBuffer.updateBuffer('*');
document.getElementById('four').onclick = calcObj.inBuffer.updateBuffer('4');
document.getElementById('five').onclick = calcObj.inBuffer.updateBuffer('5');
document.getElementById('six').onclick = calcObj.inBuffer.updateBuffer('6');
document.getElementById('minus').onclick = calcObj.inBuffer.updateBuffer('-');
document.getElementById('one').onclick = calcObj.inBuffer.updateBuffer('1');
document.getElementById('two').onclick = calcObj.inBuffer.updateBuffer('2');
document.getElementById('three').onclick = calcObj.inBuffer.updateBuffer('3');
document.getElementById('plus').onclick = calcObj.inBuffer.updateBuffer('+');
document.getElementById('zero').onclick = calcObj.inBuffer.updateBuffer('0');
document.getElementById('decimalpoint').onclick = calcObj.inBuffer.updateBuffer('.');
document.getElementById('equals').onclick = calcObj.inBuffer.updateBuffer('=');
