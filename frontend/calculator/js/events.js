window.onload = (function() {
  'use strict';

  function keyStroke(label) {
    console.log("keypressed: " + label);
    return label
  }

  // need the following to register the function
  // the HTML only runs functions attached to the window
  window.keyStroke = keyStroke;

  

}());
