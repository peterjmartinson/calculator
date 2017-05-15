(function() {

  var dom = {};
  dom.instructions = document.getElementById("instructions");
  dom.results      = document.getElementById("results");
  dom.button       = document.getElementById("search-button");

  function populateDOM() {
    dom.instructions.innerHTML  = 'instructions';
    dom.results.innerHTML       = 'results';
  }

  populateDOM();

  dom.button.onclick = function() {
    var val = dom.button.form.searchy.value;
    var out = '<ol>';
    for (let i = 0; i < 4; i++) {
      out += '<li>' + val + i + '</li>';
    }
    out += '</ol>';
    dom.results.innerHTML = out;
    console.log(dom.button.form.searchy.value);
  }

}());
