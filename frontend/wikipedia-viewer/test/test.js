QUnit.test( "cacheDOM returns an object", function( assert ) {
  // var link = document.getElementById("qunit-fixture").getElementById("footer");
  var dom = cacheDOM();
  assert.notEqual(dom, "");
});

QUnit.test( "returnOne() returns 1", function( assert) {
  assert.equal(returnOne(), 1);
});

QUnit.test( "populateDOM() should populate the DOM", function(assert) {
  var inst = document.getElementById("instructions").innerHTML;
  assert.equal(inst, "instructions");
});
