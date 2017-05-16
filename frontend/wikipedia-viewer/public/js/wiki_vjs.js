


$(document).ready(function() {
  
  'use strict';

  var dom = cacheDOM();
  var random_button = '<button id="random">Get a Random Wikipedia Article</button>';
  function returnOne() {
    return 1;
  };

  function cacheDOM() {
    return {
      instructions  : document.getElementById("instructions"),
      // search        : document.getElementById("search"),
      search_input  : document.getElementById("search-input"),
      search_button : document.getElementById("search-button"),
      random_button : document.getElementById("random-button"),
      results       : document.getElementById("results")
    }
  }

  function populateDOM() {
    dom.instructions.innerHTML  = 'instructions';
    // dom.search.innerHTML        = 'search';
    // dom.search_button.innerHTML = 'search-button';
    dom.random_button.innerHTML = random_button;
    dom.results.innerHTML       = 'results';
    // dom.search.method = 'GET';
  }
  // console.log(dom.search.value);

  function getRandomArticle() {
    var random_url = 'https://en.wikipedia.org/wiki/Special:Random';
    window.open(random_url,'_blank');
  }

  function search() {}
  function logValue() {
    console.log($("#search-input").val());
  }

  populateDOM();
  var button = document.getElementById("search-button");
  var value  = button.form.searchy.value;
  button.onclick = function() { console.log(button.form.searchy.value); };
  // $("#search-button").on("click", console.log($("#search-input").val()));
  $("#random").on("click", getRandomArticle);


});


