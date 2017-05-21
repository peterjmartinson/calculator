1. Testing:
If your functions are enclosed by jQuery's `$(document).ready(function(){...`, your QUnit test will not find the functions.  You need to comment this stuff out before running the tests.  There's got to be a better work around!!

2. HTML forms:
- The following sends you to a website:
      <form action="http://www.foo.com" method="get">
        <input name="searchy" id="search-input" type="text"
               placeholder="search Wikipedia">
        <button id="search-button">Search</button>
      </form>
If the user enters 'bar' in the search bar, then hits the button, he will be sent to
`http://www.foo.com/?searchy=bar`

- Problems with jQuery
There are (supposedly) two ways to get the value input into the form field.

First, using jQuery:
    $("#search-button").on("click", console.log($("#search-input").val()));
Second, using VanillaJS
    var button = document.getElementById("search-button");
    var value  = button.form.searchy.value;
    button.onclick = function() { console.log(button.form.searchy.value); };
The second will log the contents, while the first will not.  It is as if the value gets sent _before_ jQuery can catch it - the value nabbed by jQuery is always the empty string.  I think it has something to do with the jQuery `ready` wrapper.

3. Write the blog on "Figuring out how to navigate and use an API"
