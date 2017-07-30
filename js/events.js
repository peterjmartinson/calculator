/*jshint esversion:6, node:true */
window.onload = (function() {

  let calculator = window.calculator;

  document.addEventListener('keydown', keyHandler, 0);
  const key_map = {
      187: '=',
      80: '+',
      77: '-',
      84: '*',
      68: '/',
      48: '0',
      49: '1',
      50: '2',
      51: '3',
      52: '4',
      53: '5',
      54: '6',
      55: '7',
      56: '8',
      57: '9',
      67: 'clear'
  }

  function keyHandler(key) {
    if (key_map.hasOwnProperty(key.keyCode)) {
      calculator.sendKeyPress(key_map[key.keyCode]);
    }
  }


}());
