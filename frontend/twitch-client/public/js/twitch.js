var twitch = {};

twitch.fetchJSON = function(callback) {
  var url = 'https://wind-bow.glitch.me/twitch-api/streams/freecodecamp?callback=?';

  $.getJSON(url, function(data) {
    console.log(data);
    callback(data);
  });
  // return true;
}

