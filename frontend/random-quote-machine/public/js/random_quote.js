/**
 * Random Quote Machine, FCC
 * Produce random quotes from an online API
 * 
 * Copyright Peter Martinson
*/

$(document).ready(function() {

  var getQuote = function() {
    $.getJSON( "http://api.icndb.com/jokes/random", function ( response ) {
      $( "#quote" ).html( response.value.joke );
    });
    $.getJSON( "http://uinames.com/api/?region=germany", function( response ) {
      $( "#author" ).html( "- " + response.name + " " + response.surname );
    });
  }

  getQuote();
  $("#getMessage").on("click", getQuote);

  $("#postTweet").on("click", function() {
    var quote = document.getElementById("quote").innerHTML;
    if ( quote.length <= 140 ) {
      var twtLink = 'http://twitter.com/home?status=' +encodeURIComponent(quote);
      window.open(twtLink,'_blank');
    } else {
      alert("Quote is too long to post!");
    }

  });
});

