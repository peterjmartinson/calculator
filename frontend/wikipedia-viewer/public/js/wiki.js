/**
 * wiki.js
 *
 * 1. Search Wikipedia entries in a search box and see the resulting
 *    Wikipedia entries.
 * 2. Click a button to see a random Wikipedia entry.
 * 3. Clicking on an article opens a new window with Wikipedia
*/

$(document).ready(function() {
  
  'use strict';

  function cacheDOM() {
    return {
      instructions  : document.getElementById("instructions"),
      search        : document.getElementById("search"),
      search_button : document.getElementById("search-button"),
      random_button : document.getElementById("random-button"),
      results       : document.getElementById("results")
    }
  }

  var dom = cacheDOM();

  console.log(dom);

});


