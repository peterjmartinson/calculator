/**
 * wiki.js
 *
 * 1. Search Wikipedia entries in a search box and see the resulting
 *    Wikipedia entries.
 * 2. Click a button to see a random Wikipedia entry.
 * 3. Clicking on an article opens a new window with Wikipedia
*/

// $(document).ready(function() {
  
  'use strict';

  function returnOne() {
    return 1;
  };

  function cacheDOM() {
    return {
      instructions  : document.getElementById("instructions"),
      search        : document.getElementById("search"),
      search_button : document.getElementById("search-button"),
      random_button : document.getElementById("random-button"),
      results       : document.getElementById("results")
    }
  }

  function populateDOM() {
    dom.instructions.innerHTML  = 'instructions';
    dom.search.innerHTML        = 'search';
    dom.search_button.innerHTML = 'search-button';
    dom.random_button.innerHTML = 'random-button';
    dom.results.innerHTML       = 'results';
  }

  populateDOM();
  var dom = cacheDOM();


// });


