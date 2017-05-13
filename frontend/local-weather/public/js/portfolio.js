var Portfolio = (function() {

  'use strict'

  var DOM = {};

  function cacheDOM() {
    DOM.$portfolio = document.getElementById("portfolio");
  }

  function insertPortfolio() {
    var text = 'howdy';

    DOM.$portfolio.innerHTML = text;
  }

  function init() {
    cacheDOM();
    insertPortfolio();
  }

  return {
    init : init
  }

}());
