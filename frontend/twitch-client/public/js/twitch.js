var twitch = {};

twitch.fetchJSON = function() {
  $.getJSON('https://api.twitch.tv/kraken/streams/freecodecamp?callback=?', function(data) {
    return data;
    console.log(data);
  });
  // return true;
}

