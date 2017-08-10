/*jshint esversion:6, node:true */

'use strict';

const q = QUnit;

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

q.test('partial sequences', function(assert) {
  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*');
  assert.equal(calculator.register[4], '*', '1+2*');
  
  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2+');
  assert.equal(calculator.register[0], '3', '1+2+ -> 3');
  assert.equal(calculator.register[3], '+', '1+2+ -> 3');

  
});

q.test('continued sequences', function(assert) {
  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*3*');
  assert.equal(getScreenValue(), '6', '2*3=6');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/3*');
  assert.equal(getScreenValue(), '5', '15/3=5');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1-2*3*');
  assert.equal(getScreenValue(), '6', '2*3=6');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*3+');
  assert.equal(getScreenValue(), '7', '1+2*3+ -> 7');

  calculator.sendKeyPress('=');
  assert.equal(getScreenValue(), '14', '7+7=14');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/3+');
  assert.equal(getScreenValue(), '12', '7+15/3+ -> 12');

  calculator.sendKeyPress('=');
  assert.equal(getScreenValue(), '24', '12+12=24');

});

q.test('aborted sequences', function(assert) {
  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/+');
  assert.equal(getScreenValue(), '22', '7+15=12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15*+');
  assert.equal(getScreenValue(), '22', '7+15=12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15*-');
  assert.equal(getScreenValue(), '22', '7+15=12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/-');
  assert.equal(getScreenValue(), '22', '7+15=12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/-');
  assert.equal(getScreenValue(), '22', '7+15=12');


});

q.test('complex operations', function(assert) {
  calculator.sendKeyPress('clear');
  calculator.sendKeyPress('4');
  calculator.sendKeyPress('root');
  assert.equal(getScreenValue(), '2', '2*2=4');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*3');
  calculator.sendKeyPress('pm');
  calculator.sendKeyPress('=');
  assert.equal(getScreenValue(), '-5', '1+2*(-3)=-5');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2');
  calculator.sendKeyPress('pm');
  runCalculationSequence('*3=');
  assert.equal(getScreenValue(), '-5', '1+(-2)*3=-5');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+4');
  calculator.sendKeyPress('root');
  assert.equal(getScreenValue(), '2', '2*2=4');
  runCalculationSequence('*3=');
  assert.equal(getScreenValue(), '7', '1+2*3=7');

  calculator.sendKeyPress('clear');
  runCalculationSequence('9*6=');
  assert.equal(getScreenValue(), '54', '9*6=54');
  calculator.sendKeyPress('-');
  assert.notEqual(getScreenValue(), undefined, '54 stays in register a');
  assert.notEqual(calculator.register[0], undefined, '54 stays in register a');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1/0=');
  assert.equal(getScreenValue(), 'DIV BY 0', 'Division by zero');

  calculator.sendKeyPress('clear');
  runCalculationSequence('10000/0=');
  assert.equal(getScreenValue(), 'DIV BY 0', 'Division by zero');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+3/0=');
  assert.equal(getScreenValue(), 'DIV BY 0', 'Division by zero');

  calculator.sendKeyPress('clear');
  runCalculationSequence('9/3=');
  assert.equal(getScreenValue(), '3', '9 / 3 = 3');
  calculator.sendKeyPress('/');
  assert.equal(getScreenValue(), '3', 'Extend the calculation');

  calculator.sendKeyPress('clear');
  runCalculationSequence('9/3=');
  assert.equal(getScreenValue(), '3', '9 / 3 = 3');
  calculator.sendKeyPress('7');
  assert.equal(getScreenValue(), '7', 'Start over after a calculation');

  calculator.sendKeyPress('clear');
  runCalculationSequence('9/3=');
  assert.equal(getScreenValue(), '3', '9 / 3 = 3');
  calculator.sendKeyPress('.');
  assert.equal(getScreenValue(), '0.', 'Start over with a decimal');

});


// ========= UTILITY FUNCTIONS

let screen = document.getElementById('screen');

function getScreenValue() {
  return document.getElementById('screen').innerHTML;
}

function setCalculator(arr) {
  calculator.register[0]   = arr[0]; 
  calculator.register[1]   = arr[1]; 
  calculator.register[2]   = arr[2]; 
  calculator.register[3]   = arr[3]; 
  calculator.register[4]   = arr[4]; 
  calculator.setScreenFlag(arr[5]); 
  calculator.setState(arr[7]); 
  calculator.setCalculatorState();
}

function setBuffer(buffer) {
  calculator.register[0]  = buffer[0]; 
  calculator.register[1]  = buffer[1]; 
  calculator.register[2]  = buffer[2]; 
  calculator.register[3]  = buffer[3]; 
  calculator.register[4]  = buffer[4]; 
  calculator.buffer.screen_flag = buffer[5]; 
  calculator.buffer.state       = buffer[7]; 
  calculator.setCalculatorState();
}

function resetBuffer() {
  setBuffer(['','','','','','0',1,1]);
}

function getResult() {
  return [calculator.register[0], calculator.register[1], calculator.register[2], calculator.register[3], calculator.register[4]];
}

function stringifyBuffer() {
  return calculator.register[0] + ', '
       + calculator.register[1] + ', '
       + calculator.register[2] + ', '
       + calculator.register[3] + ', '
       + calculator.register[4] + ', '
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

let default_register = ['','','','',''];

function runCalculationSequence(string) {
  let sequence = string.split('');
  for (let i = 0; i < sequence.length; i++) {
    calculator.sendKeyPress(sequence[i]);
  }
}
















