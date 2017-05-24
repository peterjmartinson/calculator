// Testing with QUnit
var q = QUnit;

q.module('fetchJSON()');
q.test('There is a module', function(assert) {
  assert.equal(typeof twitch, 'object', 'twitch is an object');
  assert.equal(typeof twitch.fetchJSON, 'function', 'fetchJSON is a function');
});

q.test('The AJAX call succeeds', function(assert) {
  var done = assert.async();
  var channel = 'freecodecamp';
  twitch.fetchJSON(channel, function(res) {
    assert.notEqual(res, {}, 'the response is not empty');
    assert.equal(typeof res, 'object', 'there was a response');
    done();
  });
});

q.module('isStreaming()');
q.test('function exists', function(assert) {
  assert.equal(typeof twitch.isStreaming, 'function', 'isStreaming() is a function');
});

q.test('returns a number', function(assert) {
  assert.equal(typeof twitch.isStreaming({}), 'number', 'isStreaming() returns a number');
});

q.test('recognizes a streaming channel', function(assert) {
  var done = assert.async();
  var channel = 'ESL_SC2';
  twitch.fetchJSON(channel, function(res) {
    assert.equal(twitch.isStreaming(res), 1, channel + ' is streaming');
    done();
  });
});

q.test('recognizes a nonstreaming channel', function(assert) {
  var done = assert.async();
  var channel = 'freecodecamp';
  twitch.fetchJSON(channel, function(res) {
    assert.equal(twitch.isStreaming(res), 0, channel + ' is not streaming');
    done();
  });
});

q.module('getLink()');
q.test('function exists', function(assert) {
  assert.equal(typeof twitch.getLink, 'function', 'getLink() is a function');
});

q.test('returns a string', function(assert) {
  var a = {_links : { channel : 'abc'}};
  assert.equal(typeof twitch.getLink(a), 'string', 'getLink() returns a string');
});

q.test('returns a link', function(assert) {
  var done = assert.async();
  var channel = 'freecodecamp';
  twitch.fetchJSON(channel, function(res) {
    assert.equal(twitch.getLink(res).substring(0, 8), 'https://', 'getLink() returns ' + twitch.getLink(res));
    done();
  });
});
