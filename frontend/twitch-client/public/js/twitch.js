var twitch = {};

twitch.fetchJSON = function(channel, callback) {
  var url = 'https://wind-bow.glitch.me/twitch-api/streams/';
  var suffix = channel + '?callback=?';
  $.getJSON(url+suffix, function(data) {
    callback(data);
  });
};

/**
 * determines whether or not a channel is streaming
 * @params {object} object - a response object from TwitchTV API
 * @returns {number} = 1 if streaming, = 2 if not streaming
 *
 * usage: twitch.fetchJSON('<channel>', twitch.isStreaming)
*/
twitch.isStreaming = function(object) {
  if (object.stream) {
    return 1;
  } else {
    return 0;
  }
};

twitch.getLink = function(object) {
  return object._links.channel;
};


twitch.addStreamer = function(info) {
  // info has a name property
  var new_list_item = $( '<li id="streamer-' + info.name + '"></li>' );
  new_list_item.appendTo( $( 'ul' ) );
  return info;
}


/*
{"stream":null,"_links":{"self":"https://api.twitch.tv/kraken/streams/freecodecamp","channel":"https://api.twitch.tv/kraken/channels/freecodecamp"}}
*/
