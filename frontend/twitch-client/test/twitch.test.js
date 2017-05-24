// Testing with QUnit
var q = QUnit;

q.module('fetchJSON()');
q.test('There is a module', function(assert) {
  assert.equal(typeof twitch, 'object', 'twitch is an object');
  assert.equal(typeof twitch.fetchJSON, 'function', 'fetchJSON is a function');
});

q.test('The AJAX call succeeds', function(assert) {
  var done = assert.async();
  twitch.fetchJSON(function(res) {
    assert.notEqual(res, {}, 'the response is not empty');
    assert.equal(typeof res, 'object', 'there was a response');
    done();
  });
});
