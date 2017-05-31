var twitch = {};

twitch.addStreamer = function(channel, response) {
  var list_element = '',
      url          = 'https://www.twitch.tv/',
      now_streaming = {},
      new_list_element;
  console.log(channel + ":\n    " + JSON.stringify(response));
  list_element += '<li>';
  if (response == 404) {
    url += channel;
    list_element += '  <strong>' + channel + '</strong><br>';
    list_element += '  <em>&nbsp;&nbsp;&nbsp;&nbsp;does not exist.</em>';
    new_list_item = $(list_element);
  } else {
    if (response.stream) {
    now_streaming = response.stream.game,
    url += channel;
    list_element += '  <a href="' + url + '" target="_blank">';
    list_element += '  <strong>' + channel + '</strong><br>';
    list_element += '  <em>&nbsp;&nbsp;&nbsp;&nbsp;is currently streaming ' + now_streaming + '</em>';
    list_element += '  </a>';
    new_list_item = $(list_element);
    } else {
      url += channel;
      list_element += '  <a href="' + url + '" target="_blank">';
      list_element += '  <strong>' + channel + '</strong><br>';
      list_element += '  <em>&nbsp;&nbsp;&nbsp;&nbsp;is not currently streaming.</em>';
      list_element += '  </a>';
      new_list_item = $(list_element);
    }
  }
  list_element += '</li>';
  new_list_item.appendTo( $( 'ul' ) );
  return response.stream;
}

twitch.fetchStreamer = function(channel, callback) {
  var url = 'https://wind-bow.glitch.me/twitch-api/users/';
  var suffix = channel + '?callback=?';
  $.getJSON(url+suffix, function(data) {
    if ( data.status != '422' && data.status != '404' ) {
      callback(1, channel, twitch.addStreamer);
    } else {
      callback(0, channel, twitch.addStreamer);
    }
  });
};


twitch.fetchJSON = function(exists, channel, callback) {
  var url = 'https://wind-bow.glitch.me/twitch-api/streams/';
  var suffix = channel + '?callback=?';
  if (exists) {
    console.log('not 404');
    $.getJSON(url+suffix, function(data) {
      callback(channel, data);
    });
  } else {
    console.log(404);
    callback(channel, 404);
  }
};

twitch.fetchStreamer('ESL_SC2', twitch.fetchJSON);
twitch.fetchStreamer('freecodecamp', twitch.fetchJSON);
twitch.fetchStreamer('cretetion', twitch.fetchJSON);
twitch.fetchStreamer('brunofin', twitch.fetchJSON);
twitch.fetchStreamer('comster404', twitch.fetchJSON);

