/*jshint esversion:6, node:true */

'use strict';

const q = QUnit;

/*
 *          A | B | C |opA|opB|
 *         ---|---|---|---|---|
 * Case 1) 0,A|   |   |   |   |
 * Case 2)  A |   |   | + |   |
 * Case 3)  A | B |   |+,*|   |
 * Case 4)  A | B |   | + | * |
 * Case 5)  A | B | C | + | * |
**/

q.module('Run some full calculations!');

q.test('short sequences', function(assert) {
  let sequence;

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2=');
  assert.equal(getScreenValue(), '3', '1+2=3');

  calculator.sendKeyPress('clear');
  runCalculationSequence('3*5=');
  assert.equal(getScreenValue(), '15', '3*5=15');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7-22=');
  assert.equal(getScreenValue(), '-15', '7-22=-15');

  calculator.sendKeyPress('clear');
  runCalculationSequence('56/7=');
  assert.equal(getScreenValue(), '8', '56/7=8');

  calculator.sendKeyPress('clear');
  runCalculationSequence('.12+1=');
  assert.equal(getScreenValue(), '1.12', '.12+1=1.12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1.1-0.1=');
  assert.equal(getScreenValue(), '1', '1.1-0.1=1');

});

q.test('full sequences', function(assert) {
  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*3=');
  assert.equal(getScreenValue(), '7', '1+2*3=7');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7+15/3=');
  assert.equal(getScreenValue(), '12', '7+15/3=12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1-2*3=');
  assert.equal(getScreenValue(), '-5', '1-2*3=-5');

  calculator.sendKeyPress('clear');
  runCalculationSequence('7-15/3=');
  assert.equal(getScreenValue(), '2', '7-15/3=2');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+4*0.25=');
  assert.equal(getScreenValue(), '2', '1+4*0.25=2');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+4*.25=');
  assert.equal(getScreenValue(), '2', '1+4*.25=2');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+0.25*4=');
  assert.equal(getScreenValue(), '2', '1+0.25*4=2');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+.25*4=');
  assert.equal(getScreenValue(), '2', '1+.25*4=2');

});

q.test('partial sequences', function(assert) {
  calculator.sendKeyPress('clear');
  runCalculationSequence('2+*3=');
  assert.equal(getScreenValue(), '6', '2*3=6 -> replace operator case 2');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*');
  assert.equal(getScreenValue(), '2', '1+2* -> setOperator case 3');

  runCalculationSequence('3=');
  assert.equal(getScreenValue(), '7', '1+2*3=7');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2+3+');
  assert.equal(getScreenValue(), '6', '1+2+3+ -> 6 setOperator case 3');

  calculator.sendKeyPress('clear');
  runCalculationSequence('2*3+');
  assert.equal(getScreenValue(), '6', '2*3+ -> 6 setOperator case 3');

  calculator.sendKeyPress('clear');
  runCalculationSequence('2+*3=');
  assert.equal(getScreenValue(), '6', '2*3=6 -> replace operator case 2');

  calculator.sendKeyPress('clear');
  runCalculationSequence('2+3*+');
  assert.equal(getScreenValue(), '5', '2+3*+ -> 5 setOperator case 4');

  calculator.sendKeyPress('clear');
  runCalculationSequence('2+3*/');
  assert.equal(getScreenValue(), '3', 'simply replace operator case 4');

  calculator.sendKeyPress('clear');
  runCalculationSequence('2+3*5+');
  assert.equal(getScreenValue(), '17', '2+3*5=17 -> case 5: run all operations');
  
  calculator.sendKeyPress('clear');
  runCalculationSequence('2+3*5*');
  assert.equal(getScreenValue(), '15', '2+3*5* -> 2+15* case 5: inner operate');
  
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

q.test('repeated calculations', function(assert) {
  calculator.sendKeyPress('clear');
  runCalculationSequence('2+3==');
  assert.equal(getScreenValue(), '8', '2+3=5+3=8');

  calculator.sendKeyPress('clear');
  runCalculationSequence('2*3==');
  assert.equal(getScreenValue(), '18', '2*3=6*3=18');

  calculator.sendKeyPress('clear');
  runCalculationSequence('18/3==');
  assert.equal(getScreenValue(), '2', '18/3=6/3=2');

  calculator.sendKeyPress('clear');
  runCalculationSequence('18-3==');
  assert.equal(getScreenValue(), '12', '18-3=15-3=12');

  calculator.sendKeyPress('clear');
  runCalculationSequence('2+3*5==');
  assert.equal(getScreenValue(), '85', '2+3*5=17*5=85');

  calculator.sendKeyPress('clear');
  runCalculationSequence('2+3*5===');
  assert.equal(getScreenValue(), '425', '2+3*5=17*5=85*5=425');

  calculator.sendKeyPress('clear');
  runCalculationSequence('4+15/3==');
  assert.equal(getScreenValue(), '3', '4+15/3=9/3=3');

});

q.test('complex operations', function(assert) {
  calculator.sendKeyPress('clear');
  assert.equal(getScreenValue(), '0', 'Start with 0');

  calculator.sendKeyPress('1');
  assert.equal(getScreenValue(), '1', 'Replace the initial 0 with 1');

  calculator.sendKeyPress('2');
  assert.equal(getScreenValue(), '12', 'Append 2 to 1 -> 12');

  calculator.sendKeyPress('clear');
  calculator.sendKeyPress('4');
  calculator.sendKeyPress('root');
  assert.equal(getScreenValue(), '2', '4 root -> 2');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1');
  calculator.sendKeyPress('pm');
  assert.equal(getScreenValue(), '-1', 'flip first register\'s sign');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+');
  calculator.sendKeyPress('pm');
  assert.equal(getScreenValue(), '-1', 'flip first register\'s sign and transfer');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2');
  calculator.sendKeyPress('pm');
  assert.equal(getScreenValue(), '-2', 'flip second register\'s sign');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*');
  calculator.sendKeyPress('pm');
  calculator.sendKeyPress('=');
  assert.equal(getScreenValue(), '-3', 'flip second register\'s sign and transfer');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+2*3');
  calculator.sendKeyPress('pm');
  assert.equal(getScreenValue(), '-3', 'flip third register\'s sign');

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
  runCalculationSequence('4+');
  calculator.sendKeyPress('root');
  assert.equal(getScreenValue(), '2', '4+ root -> 4+2');
  calculator.sendKeyPress('=');
  assert.equal(getScreenValue(), '6', '4+2=6');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+4*');
  calculator.sendKeyPress('root');
  assert.equal(getScreenValue(), '2', '1+4* root -> 1+4*2');
  calculator.sendKeyPress('=');
  assert.equal(getScreenValue(), '9', '1+4*2=9');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+4');
  calculator.sendKeyPress('root');
  assert.equal(getScreenValue(), '2', '1+4 root -> 1+2');
  runCalculationSequence('*3=');
  assert.equal(getScreenValue(), '7', '1+2*3=7');

  calculator.sendKeyPress('clear');
  runCalculationSequence('9*6=');
  assert.equal(getScreenValue(), '54', '9*6=54');
  calculator.sendKeyPress('-');
  assert.notEqual(getScreenValue(), undefined, '54 stays in register a');

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

q.test('Error Handling', function(assert) {
  calculator.sendKeyPress('clear');
  runCalculationSequence('1/0=');
  assert.equal(getScreenValue(), 'DIV BY 0', 'Division by zero');

  calculator.sendKeyPress('clear');
  runCalculationSequence('1+1/0=');
  assert.equal(getScreenValue(), 'DIV BY 0', 'Division by zero');

  calculator.sendKeyPress('clear');
  runCalculationSequence('9999999999+10=');
  assert.equal(getScreenValue(), 'ERROR', 'Out of bounds error');

});

q.test('Screen Test', function(assert) {
  calculator.sendKeyPress('clear');
  calculator.sendKeyPress('1');
  assert.equal(getScreenValue(), '1', 'screen_flag = 0');

  calculator.sendKeyPress('+');
  assert.equal(getScreenValue(), '1', 'screen_flag = 0');

  calculator.sendKeyPress('2');
  assert.equal(getScreenValue(), '2', 'screen_flag = 1');

  calculator.sendKeyPress('*');
  assert.equal(getScreenValue(), '2', 'screen_flag = 1');

  calculator.sendKeyPress('3');
  assert.equal(getScreenValue(), '3', 'screen_flag = 2');

  calculator.sendKeyPress('=');
  assert.equal(getScreenValue(), '7', 'screen_flag = 0');

  calculator.sendKeyPress('clear');
  calculator.sendKeyPress('1');
  assert.equal(getScreenValue(), '1', 'screen_flag = 0');

  calculator.sendKeyPress('.');
  assert.equal(getScreenValue(), '1.', 'screen_flag = 0');

  calculator.sendKeyPress('1');
  assert.equal(getScreenValue(), '1.1', 'screen_flag = 0');

  calculator.sendKeyPress('+');
  assert.equal(getScreenValue(), '1.1', 'screen_flag = 0');
//
  calculator.sendKeyPress('4');
  assert.equal(getScreenValue(), '4', 'screen_flag = 1');

  calculator.sendKeyPress('root');
  assert.equal(getScreenValue(), '2', 'screen_flag = 1');

  calculator.sendKeyPress('*');
  assert.equal(getScreenValue(), '2', 'screen_flag = 1');
//
  calculator.sendKeyPress('3');
  assert.equal(getScreenValue(), '3', 'screen_flag = 2');
//
  calculator.sendKeyPress('.');
  assert.equal(getScreenValue(), '3.', 'screen_flag = 2');
//
  calculator.sendKeyPress('7');
  assert.equal(getScreenValue(), '3.7', 'screen_flag = 2');

  calculator.sendKeyPress('=');
  assert.equal(getScreenValue(), '8.5', 'screen_flag = 0');

});

// ========= UTILITY FUNCTIONS

let screen = document.getElementById('screen');

function getScreenValue() {
  return document.getElementById('screen').innerHTML;
}

function runCalculationSequence(string) {
  let sequence = string.split('');
  for (let i = 0; i < sequence.length; i++) {
    calculator.sendKeyPress(sequence[i]);
  }
}

