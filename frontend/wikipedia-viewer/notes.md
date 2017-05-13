1. Testing:
If your functions are enclosed by jQuery's `$(document).ready(function(){...`, your QUnit test will not find the functions.  You need to comment this stuff out before running the tests.  There's got to be a better work around!!
