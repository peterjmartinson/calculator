window.onload = (function() {
  'use strict';

  function key(b) {
    console.log("keypressed: " + b);
  }

  // need the following to register the function
  // the HTML only runs functions attached to the window
  window.key = key;

  

}());
