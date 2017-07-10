var q = QUnit;

q.module('keyStroke()');
q.test('There is a module', function(assert) {
  assert.equal(typeof window.keyStroke, 'function', 'keyStroke is a function');
});
q.test('It returns a value', function(assert) {
  assert.equal(window.keyStroke('clear'), 'clear', 'it returns `clear`');
  assert.equal(window.keyStroke('pm'), 'pm', 'it returns `pm`');
  assert.equal(window.keyStroke(3), 3, 'it returns 3');
});

q.module('trim()');
q.test('It exists', function(assert) {
  assert.equal(typeof calculator.trim, 'function', 'trim is a function on C');
});
q.test('It returns a string', function(assert) {
  assert.equal(typeof calculator.trim(1), 'string', 'trim returns a string');
});
q.test('It returns a string of less than 10 characters', function(assert) {
  var a = [1.11111111, 1.111111111, 1.1111111111, 1.11111111111, 1.111111111111];
  for (let i = 0; i < a.length; i++) {
    assert.equal(calculator.trim(a[i]).length, 10);
  }
});

q.module('operate()');
q.test('It exists', function(assert) {
  assert.equal(typeof calculator.operate, 'function', 'operate is a function on C');
});
q.test('It performs the correct calculations', function(assert) {
  assert.equal(calculator.operate(1, '+', 1), '2', '1+1=2');
  assert.equal(calculator.operate(2, '-', 3), '-1', '2-3=-1');
  assert.equal(calculator.operate(3, '-', 2), '1', '3-2=1');
  assert.equal(calculator.operate(2, '*', 3), '6', '2*3=6');
  assert.equal(calculator.operate(10, '/', 5), '2', '10/5=2');
  assert.equal(calculator.operate(5, '/', 10), '0.5', '5/10=0.5');
  assert.equal(calculator.operate(1, '/', 0), 'DIV BY 0', 'DIV BY 0');
  assert.equal(calculator.operate('j', '/', 's'), 'NaN', 'NaN');
});

q.module('setState()');
q.test('It exists', function(assert) {
  assert.equal(typeof calculator.setState, 'function', 'setState is a function on C');
});
q.test('It returns the correct states', function(assert) {
  setBuffer(['empty','empty','empty','empty','empty']);
  calculator.setState();
  assert.equal(calculator.buffer.state, 1, 'state 1');
  setBuffer(['empty', 'empty', 'empty', '+', 'empty']);
  calculator.setState();
  assert.equal(calculator.buffer.state, 2, 'state 2');
  setBuffer(['1', '1', 'empty', '1', 'empty']);
  calculator.setState(calculator.buffer);
  assert.equal(calculator.buffer.state, 3, 'state 3');
  setBuffer(['1', '1', 'empty', '1', '1']);
  calculator.setState(calculator.buffer);
  assert.equal(calculator.buffer.state, 4, 'state 4');
  setBuffer(['1', '1', '1', '1', '1']);
  calculator.setState(calculator.buffer);
  assert.equal(calculator.buffer.state, 5, 'state 5');
  setBuffer(['DIV BY 0', 'empty', 'empty', 'empty', 'empty']);
  calculator.setState(calculator.buffer);
  assert.equal(calculator.buffer.state, 6, 'state 6');
  setBuffer(['empty', 'DIV BY 0', 'empty', 'empty', 'empty']);
  calculator.setState(calculator.buffer);
  assert.equal(calculator.buffer.state, 6, 'state 6');
  setBuffer(['ERROR', 'empty', 'empty', 'empty', 'empty']);
  calculator.setState(calculator.buffer);
  assert.equal(calculator.buffer.state, 6, 'state 6');
  setBuffer(['empty', 'ERROR', 'empty', 'empty', 'empty']);
  calculator.setState(calculator.buffer);
  assert.equal(calculator.buffer.state, 6, 'state 6');
});

q.module('clear');
q.test('It exists', function(assert) {
  assert.equal(typeof calculator.clear, 'function', 'clear is a function on Calculator');
});
q.test('It returns the correct states', function(assert) {
  setBuffer(['1','1','1','+','*',2,'0',1]);
  calculator.clear();
  assert.deepEqual(calculator.buffer, default_buffer, 'clear resets the buffer');
});

q.module('updateScreen');
q.test('It exists', function(assert) {
  assert.equal(typeof calculator.updateScreen, 'function', 'updateScreen is a function on Calculator');
});
q.test('It returns the correct states', function(assert) {
  var fixture = $( "#qunit-fixture" );
  fixture.append("<div id='screen'>the screen</div>");
  assert.equal( $( "div", fixture ).length, 1, 'div#screen added successfully');
  var test_buffer = {
    screen_flag : 1,
    register_a : '1',
    register_b : '2',
    register_c : '3',
    operator_a : '+',
    operator_b : '*'
  };
  calculator.updateScreen(test_buffer);
  assert.equal(document.getElementById('screen').innerHTML, '1', '1 is on the screen');
  test_buffer.screen_flag = 2;
  calculator.updateScreen(test_buffer);
  assert.equal(document.getElementById('screen').innerHTML, '2', '2 is on the screen');
  test_buffer.screen_flag = 3;
  calculator.updateScreen(test_buffer);
  assert.equal(document.getElementById('screen').innerHTML, '3', '3 is on the screen');
});

q.module('setNumber');
q.test('It exists', function(assert) {
  assert.equal(typeof calculator.setNumber, 'function', 'setNumber is a function on Calculator');
});
q.test('The correct registers get filled', function(assert) {
  var number = 5;
  // state 1
  setBuffer(['empty','empty','empty','empty','empty']);
  calculator.setState();
  calculator.setNumber(number);
  assert.ok(calculator.buffer.register_a == '5' && calculator.buffer.screen_flag == 1, 'state 1 updated correctly');
  setBuffer(['27','empty','empty','empty','empty']);
  calculator.setState();
  calculator.setNumber(number);
  assert.ok(calculator.buffer.register_a == '275' && calculator.buffer.screen_flag == 1, 'state 1 updated correctly - append');
  // state 2
  setBuffer(['1','empty','empty','+','empty']);
  calculator.setState();
  calculator.setNumber(number);
  assert.ok(calculator.buffer.register_b == '5' && calculator.buffer.screen_flag == 2, 'state 2 updated correctly');
  // state 3
  setBuffer(['1','1','empty','+','empty']);
  calculator.setState();
  calculator.setNumber(number);
  assert.ok(calculator.buffer.register_b == '15' && calculator.buffer.screen_flag == 2, 'state 3 updated correctly');
  // state 4
  setBuffer(['1','1','empty','+','*']);
  calculator.setState();
  calculator.setNumber(number);
  assert.ok(calculator.buffer.register_c == '5' && calculator.buffer.screen_flag == 3, 'state 4 updated correctly');
  // state 5
  setBuffer(['1','1','1','+','*']);
  calculator.setState();
  calculator.setNumber(number);
  assert.ok(calculator.buffer.register_c == '15' && calculator.buffer.screen_flag == 3, 'state 4 updated correctly');

});

q.module('setOperator');
q.test('It exists', function(assert) {
  assert.equal(typeof calculator.setOperator, 'function', 'setOperator is a function on Calculator');
});
q.test('The correct registers get filled', function(assert) {
  var plus = '+';
  var times = '*';
  // state 1
  setBuffer(['empty','empty','empty','empty','empty']);
  calculator.setState();
  assert.equal(calculator.buffer.state, '1', 'State is correct');
  calculator.setOperator(plus);
  assert.ok(calculator.buffer.operator_a == '+' && calculator.buffer.screen_flag == 1, 'state 1: operator_a got +');
  setBuffer(['27','empty','empty','empty','empty']);
  calculator.setState();
  calculator.setOperator(plus);
  assert.ok(calculator.buffer.operator_a == '+' && calculator.buffer.screen_flag == 1, 'state 1: operator_a got +');
  // state 2
  setBuffer(['27','empty','empty','+','empty']);
  calculator.setState();
  assert.equal(calculator.buffer.state, '2', 'State is correct');
  calculator.setOperator(plus);
  assert.ok(calculator.buffer.operator_a == '+' && calculator.buffer.screen_flag == 1, 'state 2: operator_a got +');
  setBuffer(['27','empty','empty','*','empty']);
  calculator.setState();
  calculator.setOperator(plus);
  assert.ok(calculator.buffer.operator_a == '+' && calculator.buffer.screen_flag == 1, 'state 2: operator_a got +');
  // state 3
  setBuffer(['27','2','empty','+','empty']);
  calculator.setState();
  assert.equal(calculator.buffer.state, '3', 'State is correct');
  calculator.setOperator(plus);
  assert.ok(calculator.buffer.operator_a == '+' && calculator.buffer.screen_flag == 1, 'state 2: operator_a got +');
  setBuffer(['27','2','empty','*','empty']);
  calculator.setState();
  calculator.setOperator(plus);
  assert.ok(calculator.buffer.operator_a == '+' && calculator.buffer.screen_flag == 1, 'state 2: operator_a got +');
  // state 4
  setBuffer(['27','2','empty','+','+']);
  calculator.setState();
  assert.equal(calculator.buffer.state, '3', 'State is correct');
  calculator.setOperator(plus);
  assert.ok(calculator.buffer.operator_a == '+' && calculator.buffer.screen_flag == 1, 'state 2: operator_a got +');
  setBuffer(['27','2','empty','+','*']);
  calculator.setState();
  assert.equal(calculator.buffer.state, '3', 'State is correct');
  calculator.setOperator(plus);
  assert.ok(calculator.buffer.operator_a == '+' && calculator.buffer.screen_flag == 1, 'state 2: operator_a got +');
});




// ========= UTILITY FUNCTIONS

setBuffer = function(buffer) {
  calculator.buffer.register_a  = buffer[0]; 
  calculator.buffer.register_b  = buffer[1]; 
  calculator.buffer.register_c  = buffer[2]; 
  calculator.buffer.operator_a  = buffer[3]; 
  calculator.buffer.operator_b  = buffer[4]; 
  calculator.buffer.screen_flag = buffer[5]; 
  calculator.buffer.screen      = buffer[6]; 
  calculator.buffer.state       = buffer[7]; 
}


var default_buffer = {
  register_a  : 'empty',
  register_b  : 'empty',
  register_c  : 'empty',
  operator_a  : 'empty',
  operator_b  : 'empty',
  screen      : '0',
  screen_flag : 1,
  state       : 1
};
