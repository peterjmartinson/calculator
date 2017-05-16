console.log("in test.js");
QUnit.test( "populateDOM() should populate the DOM", function(assert) {
  var inst = document.getElementById("instructions").innerHTML;
  assert.equal(inst, "instructions");
});

QUnit.test("getRandomArticle() should open a new page", function(assert) {
  assert.equal(0, 0);
});

QUnit.test("listResults() should return a list", function(assert) {
  var mock_results = { query : { search : [
    {
      title : 'First result',
      snippet : 'First snippet'
    },
    {
      title : 'Second result',
      snippet : 'Second snippet'
    },
    {
      title : 'Third result',
      snippet : 'Third snippet'
    },
    {
      title : 'Fourth result',
      snippet : 'Fourth snippet'
    }
  ]}};
  console.log(listResults(mock_results));
  assert.notEqual(listResults(mock_results), '');
});

QUnit.test("returnOne() should return 1", function(assert) {
  assert.equal(returnOne(), 1);
});
