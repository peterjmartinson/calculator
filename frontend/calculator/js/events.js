window.onload = (function() {
  'use strict';

  let key_stroke = '';

  function keyStroke(label) {
    console.log("keypressed: " + label);
    return label
  }

  // document.addEventListener('keydown', keyDownHandler, 0);
  // document.addEventListener('keyup', keyUpHandler, 0);
  document.addEventListener('keydown', keyHandler, 0);

  function keyDownHandler(key) {
    console.log("keydown: " + key.keyCode);
  }

  function keyUpHandler(key) {
    console.log("keydown: " + key.keyCode);
  }

  function getKeyName(key) {
    // console.log('keyCode: ' + key.keyCode);
    let button = '';
    switch(key.keyCode) {
      case 187:
        return '=';
        break;
      case 80:
        return '+';
        break;
      case 77:
        return '-';
        break;
      case 84:
        return '*';
        break;
      case 68:
        return '/';
        break;
      case 48:
        return '0';
        break;
      case 49:
        return '1';
        break;
      case 50:
        return '2';
        break;
      case 51:
        return '3';
        break;
      case 52:
        return '4';
        break;
      case 53:
        return '5';
        break;
      case 54:
        return '6';
        break;
      case 55:
        return '7';
        break;
      case 56:
        return '8';
        break;
      case 57:
        return '9';
        break;
      default:
        break;
    }
  }

  function keyHandler(key) {
    let key_name = getKeyName(key);
    if ( key_name ) {
      keyStroke
      console.log(key_name);
    }
  }

  // need the following to register the function
  // the HTML only runs functions attached to the window
  window.key_stroke = key_stroke;
  window.keyStroke = keyStroke;


}());
