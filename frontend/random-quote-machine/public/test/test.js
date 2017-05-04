QUnit.test( "footer loads", function( assert ) {
  // var link = document.getElementById("qunit-fixture").getElementById("footer");
  var footer = document.getElementById("footer");
  assert.equal(footer.innerHTML, "");
  Footer.init();
  assert.notEqual(footer.innerHTML, "");
});

QUnit.test( "portfolio loads", function( assert ) {
  // var link = document.getElementById("qunit-fixture").getElementById("footer");
  var portfolio = document.getElementById("portfolio");
  assert.equal(portfolio.innerHTML, "");
  Portfolio.init();
  assert.notEqual(portfolio.innerHTML, "");
});
