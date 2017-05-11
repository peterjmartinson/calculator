var Footer = (function() {

  'use strict'

  var page_name = 'Portfolio 1.0',
      DOM = {};

  function cacheDOM() {
    DOM.$footer = document.getElementById("footer");
  }

  function insertFooter() {
    var text = '';
    text += '<div class="copyright">&copy; 2017 Peter Martinson</div>';
    text += '<div class="github"><a href="https://github.com/peterjmartinson/chingu-fcc-speedrun-challenge/tree/master/frontend/tribute-page">FCC : ' + page_name + '</a></div>';
    text += '<div class="license">MIT License</div>';

    DOM.$footer.innerHTML = text;
  }

  function init() {
    cacheDOM();
    insertFooter();
  }

  return {
    init : init
  }

}());

