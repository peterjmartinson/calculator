QUnit.test( "footer loads", function( assert ) {
  // var link = document.getElementById("qunit-fixture").getElementById("footer");
  var link = document.getElementById("footer");

  assert.equal(link.innerHTML, "");
  Footer.init();
  assert.equal(link.innerHTML, "");
});

