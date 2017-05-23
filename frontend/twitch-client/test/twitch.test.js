// Testing with QUnit

QUnit.test('there is a module', function(assert) {
  assert.equal(typeof twitch, 'object');
  assert.equal(typeof twitch.fetchJSON, 'function');
});

QUnit.test('fetchJSON() returns a value', function(assert) {
  assert.notEqual(twitch.fetchJSON(), '');
});
