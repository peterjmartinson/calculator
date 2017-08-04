/*jshint esversion:6, node:true */

'use strict';

const q = QUnit;

q.module('Fundamental Operations');

q.test('exist', function(assert) {
  assert.equal(typeof calculator.operate, 'function', 'operate is a function');
  assert.equal(typeof calculator.reckonInside, 'function', 'reckonInside is a function');
  assert.equal(typeof calculator.reckonOutside, 'function', 'reckonOutside is a function');
});

q.test('operate() performs simple calculations', function(assert) {
  let a = ['1', '+', '1'],
      b = ['2', '-', '7'],
      c = ['3', '*', '6'],
      d = ['12', '/', '3'];
  assert.equal(calculator.operate(a[0], a[1], a[2]), '2', '1+1=2');
  assert.equal(calculator.operate(b[0], b[1], b[2]), '-5', '2-7=-5');
  assert.equal(calculator.operate(c[0], c[1], c[2]), '18', '3*6=18');
  assert.equal(calculator.operate(d[0], d[1], d[2]), '4', '12/3=4');
});

q.test('operate() handles blanks', function(assert) {
  let a = ['1','',''],
      b = ['1','+',''];
  assert.equal(calculator.operate(a[0], a[1], a[2]), '1', 'in the operator');
  assert.equal(calculator.operate(b[0], b[1], b[2]), '1', 'in right hand side');
});

q.test('reckonInside() performs simple calculations', function(assert) {
  setCalculator(['1', '2', '3', '+', '*']);
  calculator.reckonInside();
  assert.deepEqual(getResult(), ['1', '6', '3', '+', '*'], '2*3=6');

  setCalculator(['1', '12', '3', '+', '/']);
  calculator.reckonInside();
  assert.deepEqual(getResult(), ['1', '4', '3', '+', '/'], '12/3=4');

  setCalculator(['1', '2', '3', '-', '*']);
  calculator.reckonInside();
  assert.deepEqual(getResult(), ['1', '6', '3', '-', '*'], '2*3=6');

  setCalculator(['1', '12', '3', '-', '/']);
  calculator.reckonInside();
  assert.deepEqual(getResult(), ['1', '4', '3', '-', '/'], '12/3=4');
});

q.test('reckonInside() sets the screen flag', function(assert) {
  setCalculator(['1', '2', '3', '+', '*']);
  calculator.reckonInside();
  assert.equal(calculator.getScreenFlag(), 2, 'to point at register b');
});
  

q.test('reckonOutside() performs simple calculations', function(assert) {
  setCalculator(['1', '2', '3', '+', '*']);
  calculator.reckonOutside();
  assert.deepEqual(getResult(), ['3', '2', '3', '+', '*'], '1+2=3');

  setCalculator(['1', '12', '3', '+', '/']);
  calculator.reckonOutside();
  assert.deepEqual(getResult(), ['13', '12', '3', '+', '/'], '1+12=12');

  setCalculator(['1', '2', '3', '-', '*']);
  calculator.reckonOutside();
  assert.deepEqual(getResult(), ['-1', '2', '3', '-', '*'], '1-2=-1');

  setCalculator(['1', '12', '3', '-', '/']);
  calculator.reckonOutside();
  assert.deepEqual(getResult(), ['-11', '12', '3', '-', '/'], '1-12=-11');
});

q.test('reckonOutside() sets the screen flag', function(assert) {
  setCalculator(['1', '12', '3', '-', '/']);
  calculator.reckonOutside();
  assert.equal(calculator.getScreenFlag(), 1, 'to point at register a');
});
  
q.test('reckonAll() performs the whole calculation', function(assert) {
  setCalculator(['1', '2', '3', '+', '*']);
  calculator.reckonAll();
  assert.deepEqual(getResult(), ['7', '6', '3', '+', '*'], '1+(2*3)=7');

  setCalculator(['1', '12', '3', '+', '/']);
  calculator.reckonAll();
  assert.deepEqual(getResult(), ['5', '4', '3', '+', '/'], '1+(12/3)=5');

  setCalculator(['1', '2', '3', '-', '*']);
  calculator.reckonAll();
  assert.deepEqual(getResult(), ['-5', '6', '3', '-', '*'], '1-(2*3)=-5');

  setCalculator(['1', '12', '3', '-', '/']);
  calculator.reckonAll();
  assert.deepEqual(getResult(), ['-3', '4', '3', '-', '/'], '1-(12/3)=-3');
});

q.module('trim()');
q.test('exists', function(assert) {
  assert.equal(typeof calculator.trim, 'function', 'trim is a function on C');
});
q.test('returns a string', function(assert) {
  assert.equal(typeof calculator.trim(1), 'string', 'trim returns a string');
});
q.test('returns a string of less than 10 characters', function(assert) {
  var a = [1.11111111, 1.111111111, 1.1111111111, 1.11111111111, 1.111111111111];
  for (let i = 0; i < a.length; i++) {
    assert.equal(calculator.trim(a[i]).length, 10);
  }
});

q.module('screen_flag');
q.test('has a setter and getter', function(assert) {
  assert.equal(typeof calculator.getScreenFlag, 'function', 'getScreenFlag is a function on C');
  assert.equal(typeof calculator.setScreenFlag, 'function', 'setScreenFlag is a function on C');
});
q.test('can be set and gotten', function(assert) {
  calculator.setScreenFlag(1);
  assert.equal(calculator.getScreenFlag(), 1, 'screen_flag gets set and got');
  calculator.setScreenFlag(2);
  assert.equal(calculator.getScreenFlag(), 2, 'screen_flag gets set and got');

});

q.module('state');
q.test('has a setter and getter', function(assert) {
  assert.equal(typeof calculator.getState, 'function', 'getState is a function on C');
  assert.equal(typeof calculator.setState, 'function', 'setState is a function on C');
});
q.test('can be set and gotten', function(assert) {
  calculator.setState(1);
  assert.equal(calculator.getState(), 1, 'screen_flag gets set and got');
  calculator.setState(2);
  assert.equal(calculator.getState(), 2, 'screen_flag gets set and got');

});

q.module('setCalculatorState()');
q.test('exists', function(assert) {
  assert.equal(typeof calculator.setCalculatorState, 'function', 'setCalculatorState is a function on C');
});
q.test('returns the correct states', function(assert) {

  setCalculator(['','','','','']);
  assert.equal(calculator.getState(), 1, 'state 1');

  setCalculator(['', '', '', '+', '']);
  assert.equal(calculator.getState(), 2, 'state 2');

  setCalculator(['1', '1', '', '1', '']);
  assert.equal(calculator.getState(), 3, 'state 3');

  setCalculator(['1', '1', '', '1', '1']);
  assert.equal(calculator.getState(), 4, 'state 4');

  setCalculator(['1', '1', '1', '1', '1']);
  assert.equal(calculator.getState(), 5, 'state 5');
});

q.module('clear');
q.test('exists', function(assert) {
  assert.equal(typeof calculator.clear, 'function', 'clear is a function on Calculator');
});
q.test('resets the calculator', function(assert) {
  setCalculator(['1','1','1','+','*',2,'0',1]);
  calculator.clear();
  assert.deepEqual(calculator.register, default_register, 'clear resets the registers');
  assert.deepEqual(calculator.operator, default_operator, 'clear resets the operators');
  assert.deepEqual(calculator.getScreenFlag(), 1, 'clear resets the screen flag');
  assert.deepEqual(calculator.getState(), 1, 'clear resets the state');
  assert.deepEqual(document.getElementById('screen').innerHTML, '0', 'clear resets the screen');
});

q.module('updateScreen');
q.test('exists', function(assert) {
  assert.equal(typeof calculator.updateScreen, 'function', 'updateScreen is a function on Calculator');
});
q.test('returns the correct states', function(assert) {
  setCalculator(['1', '2', '3', '+', '*']);

  calculator.setScreenFlag(1);
  calculator.updateScreen();
  assert.equal(document.getElementById('screen').innerHTML, '1', '1 is on the screen');

  calculator.setScreenFlag(2);
  calculator.updateScreen();
  assert.equal(document.getElementById('screen').innerHTML, '2', '2 is on the screen');

  calculator.setScreenFlag(3);
  calculator.updateScreen();
  assert.equal(document.getElementById('screen').innerHTML, '3', '3 is on the screen');
});

q.module('setNumber');
q.test('exists', function(assert) {
  assert.equal(typeof calculator.setNumber, 'function', 'setNumber is a function on Calculator');
});
q.test('fills the correct registers', function(assert) {
  calculator.setKeyPress('5');

  // state 1
  setCalculator(['','','','','']);
  calculator.setNumber();
  assert.ok(calculator.register[0] == '5' && calculator.getScreenFlag() == 1, 'state 1 updated correctly');

  setCalculator(['27','','','','']);
  calculator.setNumber();
  assert.ok(calculator.register[0] == '275' && calculator.getScreenFlag() == 1, 'state 1 updated correctly - append');

  // state 2
  setCalculator(['1','','','+','']);
  calculator.setNumber();
  assert.ok(calculator.register[1] == '5' && calculator.getScreenFlag() == 2, 'state 2 updated correctly');

  // state 3
  setCalculator(['1','1','','+','']);
  calculator.setNumber();
  assert.ok(calculator.register[1] == '15' && calculator.getScreenFlag() == 2, 'state 3 updated correctly');

  // state 4
  setCalculator(['1','1','','+','*']);
  calculator.setNumber();
  assert.ok(calculator.register[2] == '5' && calculator.getScreenFlag() == 3, 'state 4 updated correctly');

  // state 5
  setCalculator(['1','1','1','+','*']);
  calculator.setNumber();
  assert.ok(calculator.register[2] == '15' && calculator.getScreenFlag() == 3, 'state 4 updated correctly');
});

q.module('setOperator');
q.test('exists', function(assert) {
  assert.equal(typeof calculator.setOperator, 'function', 'setOperator is a function on Calculator');
});

q.test('fills the correct registers', function(assert) {
  let plus = '+',
      times = '*';

  // state 1
  calculator.setKeyPress(plus);
  setCalculator(['','','','','']);
  calculator.setOperator();
  assert.ok(calculator.operator[0] == '+' && calculator.getScreenFlag() == 1, 'state 1: a');

  calculator.setKeyPress(plus);
  setCalculator(['27','','','','']);
  calculator.setOperator();
  assert.ok(calculator.operator[0] == '+' && calculator.getScreenFlag() == 1, 'state 1: b');

  // state 2
  calculator.setKeyPress(plus);
  setCalculator(['27','','','+','']);
  calculator.setOperator();
  assert.ok(calculator.operator[0] == '+' && calculator.getScreenFlag() == 1, 'state 2: a');

  calculator.setKeyPress(plus);
  setCalculator(['27','','','*','']);
  calculator.setOperator();
  assert.ok(calculator.operator[0] == '+' && calculator.getScreenFlag() == 1, 'state 2: b');

  // state 3
  calculator.setKeyPress(plus);
  setCalculator(['27','2','','+','']);
  calculator.setOperator();
  assert.ok(calculator.operator[0] == '+' && calculator.getScreenFlag() == 1, 'state 3: a');

  calculator.setKeyPress(times);
  setCalculator(['27','2','','+','']);
  calculator.setOperator();
  assert.ok(calculator.operator[1] == '*' && calculator.getScreenFlag() == 2, 'state 3: b');

  // state 4
  calculator.setKeyPress(plus);
  setCalculator(['27','2','','+','+']);
  calculator.setOperator();
  assert.ok(calculator.operator[0] == '+' && calculator.getScreenFlag() == 1, 'state 4: a');

  calculator.setKeyPress(plus);
  setCalculator(['27','2','','+','*']);
  calculator.setOperator();
  assert.ok(calculator.operator[0] == '+' && calculator.getScreenFlag() == 1, 'state 4: b');

  calculator.setKeyPress(times);
  setCalculator(['27','2','','+','+']);
  calculator.setOperator();
  assert.ok(calculator.operator[1] == '*' && calculator.getScreenFlag() == 2, 'state 4: a');

  calculator.setKeyPress(times);
  setCalculator(['27','2','','+','*']);
  calculator.setOperator();
  assert.ok(calculator.operator[1] == '*' && calculator.getScreenFlag() == 2, 'state 4: b');

  // resetCalculator();
});

q.module('routeKeyPress');
q.test('exists', function(assert) {
  assert.equal(typeof calculator.routeKeyPress, 'function', 'routeKeyPress is a function on Calculator');
});

q.test('aborts if there is an error', function(assert) {
  calculator.sendKeyPress('clear');
  calculator.setError();
  calculator.setKeyPress('1');
  calculator.routeKeyPress();
  assert.ok(calculator.getError());
});

q.test('sends a number into a register', function(assert) {
  calculator.sendKeyPress('clear');
  calculator.setKeyPress('4');
  calculator.routeKeyPress();
  assert.equal(calculator.register[0], '4', 'routeKeyPress sends 4 to register a');
});

q.test('sends an operator into a register', function(assert) {
  setCalculator(['1', '', '', '', '']);
  calculator.setKeyPress('+');
  calculator.routeKeyPress();
  assert.equal(calculator.operator[0], '+', 'routeKeyPress sends + to operator a');
});

q.test('sends an operator into a register', function(assert) {
  setCalculator(['1', '2', '', '+', '']);
  calculator.setKeyPress('*');
  calculator.routeKeyPress();
  assert.equal(calculator.operator[1], '*', 'routeKeyPress sends * to operator b');
});

q.test('`pm` changes the sign of the displayed register', function(assert) {
  setCalculator(['1', '2', '', '+', '']);
  calculator.setKeyPress('pm');
  calculator.routeKeyPress();
  assert.equal(calculator.register[1], '-2', 'routeKeyPress changes sign of a register');
});

q.test('appends a decimal point', function(assert) {
  setCalculator(['1', '2', '', '+', '']);
  calculator.setKeyPress('.');
  calculator.routeKeyPress();
  assert.equal(calculator.register[1], '2.', 'routeKeyPress appends a decimal point');
});

q.test('causes a square root to be taken', function(assert) {
  setCalculator(['1', '9', '', '+', '']);
  calculator.setKeyPress('root');
  calculator.routeKeyPress();
  assert.equal(calculator.register[1], '3', 'routeKeyPress takes a root');
});

q.test('clears the screen', function(assert) {
  setCalculator(['1', '9', '', '+', '']);
  calculator.setKeyPress('clear');
  calculator.routeKeyPress();
  assert.equal(document.getElementById('screen').innerHTML, '0', 'routeKeyPress clears the screen');
});

q.test('performs a full calculation', function(assert) {
  setCalculator(['1', '9', '', '+', '']);
  calculator.setKeyPress('=');
  calculator.routeKeyPress();
  assert.deepEqual(calculator.register[0], '10', 'routeKeyPress responds to =');
});



q.module('sendKeyPress');
q.test('exists', function(assert) {
  assert.equal(typeof calculator.sendKeyPress, 'function', 'sendKeyPress is a function on Calculator');
});

q.test('clears the screen', function(assert) {
  setCalculator(['1', '9', '', '+', '']);
  calculator.sendKeyPress('clear');
  assert.equal(document.getElementById('screen').innerHTML, '0', 'sendKeyPress clears the screen');
});

q.test('sends a number into a register', function(assert) {
  calculator.sendKeyPress('4');
  assert.equal(calculator.register[0], '4', 'sendKeyPress sends 4 to register a');
});

q.test('sends an operator into a register', function(assert) {
  setCalculator(['1', '2', '', '+', '']);
  calculator.sendKeyPress('*');
  assert.equal(calculator.operator[1], '*', 'sendKeyPress sends * to operator b');
});

q.test('`pm` changes the sign of the displayed register', function(assert) {
  setCalculator(['1', '2', '', '+', '']);
  calculator.sendKeyPress('pm');
  assert.equal(calculator.register[1], '-2', 'sendKeyPress changes sign of a register');
});

q.test('appends a decimal point', function(assert) {
  setCalculator(['1', '2', '', '+', '']);
  calculator.sendKeyPress('.');
  assert.equal(calculator.register[1], '2.', 'sendKeyPress appends a decimal point');
});

q.test('causes a square root to be taken', function(assert) {
  setCalculator(['1', '9', '', '+', '']);
  calculator.sendKeyPress('root');
  assert.equal(calculator.register[1], '3', 'sendKeyPress takes a root');
});

q.test('performs a full calculation', function(assert) {
  setCalculator(['1', '9', '', '+', '']);
  calculator.sendKeyPress('=');
  assert.deepEqual(calculator.register[0], '10', 'sendKeyPress responds to =');
});


q.module('flipSign');
q.test('exists', function(assert) {
  assert.equal(typeof calculator.flipSign, 'function', 'It is a function');
});

q.test('sets the correct signs', function(assert) {
  setCalculator(['1', '', '', '', '']);
  calculator.setKeyPress('plusminus');
  calculator.flipSign();

  assert.equal(calculator.register[0], '-1', 'flipSign flipped register a');

  setCalculator(['1', '2', '', '+', '']);
  calculator.setKeyPress('plusminus');
  calculator.flipSign();

  assert.equal(calculator.register[1], '-2', 'flipSign flipped register b');

  setCalculator(['1', '2', '3', '+', '*']);
  calculator.setKeyPress('plusminus');
  calculator.flipSign();

  assert.equal(calculator.register[2], '-3', 'flipSign flipped register c');

});

q.module('appendDecimal');
q.test('exists', function(assert) {
  assert.equal(typeof calculator.appendDecimal, 'function', 'is a function');
});

q.test('adds a decimal', function(assert) {
  setCalculator(['1', '', '', '', '']);
  calculator.setKeyPress('.');
  calculator.appendDecimal();

  assert.equal(calculator.register[0], '1.', 'added a decimal to register a');

  setCalculator(['1', '2', '', '+', '']);
  calculator.setKeyPress('.');
  calculator.appendDecimal();

  assert.equal(calculator.register[1], '2.', 'added a decimal to register b');

  setCalculator(['1', '2', '3', '+', '*']);
  calculator.setKeyPress('.');
  calculator.appendDecimal();

  assert.equal(calculator.register[2], '3.', 'added a decimal to register c');

  setCalculator(['', '', '', '', '']);
  calculator.setKeyPress('.');
  calculator.appendDecimal();

  assert.equal(calculator.register[0], '0.', 'added 0. to register a');

  setCalculator(['1', '', '', '+', '']);
  calculator.setKeyPress('.');
  calculator.appendDecimal();

  assert.equal(calculator.register[1], '0.', 'added 0. to register b');

  setCalculator(['1', '2', '', '+', '*']);
  calculator.setKeyPress('.');
  calculator.appendDecimal();

  assert.equal(calculator.register[2], '0.', 'added 0. to register c');

});

q.module('calculateSquareRoot');
q.test('exists', function(assert) {
  assert.equal(typeof calculator.calculateSquareRoot, 'function', 'is a function');
});

q.test('calculates square roots', function(assert) {
  setCalculator(['16', '', '', '', '']);
  calculator.setKeyPress('root');
  calculator.calculateSquareRoot();

  assert.equal(calculator.register[0], '4', 'changed 16 to 4 in register a');

  setCalculator(['16', '', '', '+', '']);
  calculator.setKeyPress('root');
  calculator.calculateSquareRoot();

  assert.equal(calculator.register[1], '4', 'put 4 in register b');

  setCalculator(['16', '25', '', '+', '']);
  calculator.setKeyPress('root');
  calculator.calculateSquareRoot();

  assert.equal(calculator.register[1], '5', 'changed 25 to 5 in register b');

  setCalculator(['16', '25', '', '+', '*']);
  calculator.setKeyPress('root');
  calculator.calculateSquareRoot();

  assert.equal(calculator.register[2], '5', 'put 5 in register c');

  setCalculator(['16', '25', '121', '+', '*']);
  calculator.setKeyPress('root');
  calculator.calculateSquareRoot();

  assert.equal(calculator.register[2], '11', 'changed 121 to 11 in register c');

});



q.module('Run some full calculations!');

q.test('short sequences', function(assert) {
  let sequence;

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2=');
  assert.equal(calculator.register[0], '3', '1+2=3');

  calculator.sendKeyPress('clear');
  runCalculationSequence('3*5=');
  assert.equal(calculator.register[0], '15', '3*5=15');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7-22=');
  assert.equal(calculator.register[0], '-15', '7-22=-15');

  calculator.sendKeyPress('clear');
  runCalculationSequence('56/7=');
  assert.equal(calculator.register[0], '8', '56/7=8');

});

q.test('full sequences', function(assert) {
  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*3=');
  assert.equal(calculator.register[0], '7', '1+2*3=7');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/3=');
  assert.equal(calculator.register[0], '12', '7+15/3=12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1-2*3=');
  assert.equal(calculator.register[0], '-5', '1-2*3=-5');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/3=');
  assert.equal(calculator.register[0], '12', '7+15/3=12');

});

q.test('continued sequences', function(assert) {
  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*3*');
  assert.equal(calculator.register[1], '6', '2*3=6');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/3*');
  assert.equal(calculator.register[1], '5', '15/3=5');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1-2*3*');
  assert.equal(calculator.register[1], '6', '2*3=6');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*3+');
  assert.equal(calculator.register[0], '7', '1+2*3+ -> 7');

  calculator.sendKeyPress('=');
  assert.equal(calculator.register[0], '14', '7+7=14');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/3+');
  assert.equal(calculator.register[0], '12', '7+15/3+ -> 12');

  calculator.sendKeyPress('=');
  assert.equal(calculator.register[0], '24', '12+12=24');

});

q.test('aborted sequences', function(assert) {
  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/+');
  assert.equal(calculator.register[0], '22', '7+15=12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15*+');
  assert.equal(calculator.register[0], '22', '7+15=12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15*-');
  assert.equal(calculator.register[0], '22', '7+15=12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/-');
  assert.equal(calculator.register[0], '22', '7+15=12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/-');
  assert.equal(calculator.register[0], '22', '7+15=12');


});

q.test('complex operations', function(assert) {
  calculator.sendKeyPress('clear');
  calculator.sendKeyPress('4');
  calculator.sendKeyPress('root');
  assert.equal(calculator.register[0], '2', '2*2=4');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*3');
  calculator.sendKeyPress('pm');
  calculator.sendKeyPress('=');
  assert.equal(calculator.register[0], '-5', '1+2*(-3)=-5');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2');
  calculator.sendKeyPress('pm');
  runCalculationSequence('*3=');
  assert.equal(calculator.register[0], '-5', '1+(-2)*3=-5');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+4');
  calculator.sendKeyPress('root');
  assert.equal(calculator.register[1], '2', '2*2=4');
  runCalculationSequence('*3=');
  assert.equal(calculator.register[0], '7', '1+2*3=7');

  calculator.sendKeyPress('clear');
  runCalculationSequence('9*6=');
  assert.equal(calculator.register[0], '54', '9*6=54');
  calculator.sendKeyPress('-');
  assert.notEqual(calculator.register[0], undefined, '54 stays in register a');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1/0=');
  assert.equal(calculator.register[0], 'DIV BY 0', 'Division by zero');

  calculator.sendKeyPress('clear');
  runCalculationSequence('10000/0=');
  assert.equal(calculator.register[0], 'DIV BY 0', 'Division by zero');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+3/0=');
  assert.equal(calculator.register[1], 'DIV BY 0', 'Division by zero');

  calculator.sendKeyPress('clear');
  runCalculationSequence('9/3=');
  assert.equal(calculator.register[0], '3', '9 / 3 = 3');
  calculator.sendKeyPress('/');
  assert.equal(calculator.register[0], '3', 'Begin a new calculation');

});


q.module('Error Handlers');
q.test('Div by 0', function(assert) {
  calculator.divisionByZero();
  assert.equal(calculator.getError(), 1, 'gets set correctly');
});
q.test('Error', function(assert) {
  calculator.setError();
  assert.equal(calculator.getError(), 1, 'gets set correctly');
});

// ========= UTILITY FUNCTIONS

function setCalculator(arr) {
  calculator.register[0]   = arr[0]; 
  calculator.register[1]   = arr[1]; 
  calculator.register[2]   = arr[2]; 
  calculator.operator[0]   = arr[3]; 
  calculator.operator[1]   = arr[4]; 
  calculator.setScreenFlag(arr[5]); 
  calculator.setState(arr[7]); 
  calculator.setCalculatorState();
}

function setBuffer(buffer) {
  calculator.register[0]  = buffer[0]; 
  calculator.register[1]  = buffer[1]; 
  calculator.register[2]  = buffer[2]; 
  calculator.operator[0]  = buffer[3]; 
  calculator.operator[1]  = buffer[4]; 
  calculator.buffer.screen_flag = buffer[5]; 
  calculator.buffer.state       = buffer[7]; 
  calculator.setCalculatorState();
}

function resetBuffer() {
  setBuffer(['','','','','','0',1,1]);
}

function getResult() {
  return [calculator.register[0], calculator.register[1], calculator.register[2], calculator.operator[0], calculator.operator[1]];
}

function stringifyBuffer() {
  return calculator.register[0] + ', '
       + calculator.register[1] + ', '
       + calculator.register[2] + ', '
       + calculator.operator[0] + ', '
       + calculator.operator[1] + ', '
       + calculator.getState();
}
  

let default_buffer = {
  register_a  : '',
  register_b  : '',
  register_c  : '',
  operator_a  : '',
  operator_b  : '',
  screen_flag : 1,
  state       : 1
};

let default_register = ['','',''];
let default_operator = ['',''];

function runCalculationSequence(string) {
  let sequence = string.split('');
  for (let i = 0; i < sequence.length; i++) {
    calculator.sendKeyPress(sequence[i]);
  }
}
















