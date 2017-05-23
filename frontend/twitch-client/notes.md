1. See if FCC is currently streaming on Twitch
$.getJSON('https://api.twitch.tv/kraken/streams/freecodecamp?callback=?', function(data) {
  console.log(data);
});
