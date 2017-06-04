var twitch = {};

/**
 * Adds streamer information to the webpage
 *   hint: this is the callback!
 * @params {string} The name of the streamer
 * @params {string} The link to the streamer's avatar
 * @params {object} Response package from Twitch
 * @returns {object} The streamer's information
*/
twitch.addStreamer = function(channel, logo, response) {
  var list_element = '',
      url          = 'https://www.twitch.tv/',
      now_streaming = {},
      new_list_element;
  list_element += '<li>';
  if (response == 404) {
    url += channel;
    list_element += '  <div class="logo"><img src="' + logo + '"></div>';
    list_element += '  <div class="streamer">';
    list_element += '    <strong>' + channel + '</strong><br>';
    list_element += '    <em>&nbsp;&nbsp;&nbsp;&nbsp;does not exist.</em>';
    list_element += '  </div>'
    new_list_item = $(list_element);
  } else {
    if (response.stream) {
    now_streaming = response.stream.game,
    url += channel;
    list_element += '  <a href="' + url + '" target="_blank">';
    list_element += '    <div class="logo"><img src="' + logo + '"></div>';
    list_element += '    <div class="streamer">';
    list_element += '      <strong>' + channel + '</strong><br>';
    list_element += '      <em>&nbsp;&nbsp;&nbsp;&nbsp;is currently streaming ' + now_streaming + '</em>';
    list_element += '    </div>'
    list_element += '  </a>';
    new_list_item = $(list_element);
    } else {
      url += channel;
      list_element += '  <a href="' + url + '" target="_blank">';
      list_element += '    <div class="logo"><img src="' + logo + '"></div>';
      list_element += '    <div class="streamer">';
      list_element += '      <strong>' + channel + '</strong><br>';
      list_element += '      <em>&nbsp;&nbsp;&nbsp;&nbsp;is not currently streaming.</em>';
      list_element += '    </div>'
      list_element += '  </a>';
      new_list_item = $(list_element);
    }
  }
  list_element += '</li>';
  new_list_item.appendTo( $( 'ul' ) );
  return response.stream;
}

/**
 * See if a channel is currently streaming, or even exists
 *   hint: this function calls twitch.addStreamer() !!
 * @params {string} The name of the streamer
 * @params {function} Function that receives the data, usually fetchJSON()
*/
twitch.fetchStreamer = function(channel, callback) {
  var url = 'https://wind-bow.glitch.me/twitch-api/users/';
  var suffix = channel + '?callback=?';
  $.getJSON(url+suffix, function(data) {

    var logo_url = 'https://wind-bow.glitch.me/twitch-api/channels/';
    var logo_suffix = channel + '?callback=?';
    $.getJSON(logo_url+logo_suffix, function(logo_data) {
      var logo = logo_data.logo != null ? logo_data.logo : "https://dummyimage.com/64x64/ffd9aa/552f00.png&text=@";
      if ( data.status != '422' && data.status != '404' ) {
        callback(1, channel, logo, twitch.addStreamer);
      } else {
        callback(0, channel, logo, twitch.addStreamer);
      }
    });
  });
};


/**
 * Get the streaming channel's info
 *
 * @params {boolean} Flag that indicates whether the channel exists
 * @params {string} The name of the streamer
 * @params {string} The link to the streamer's avatar
 * @params {function} Function that receives the data, usually addStreamer()
*/
twitch.fetchJSON = function(exists, channel, logo, callback) {
  var url = 'https://wind-bow.glitch.me/twitch-api/streams/';
  var suffix = channel + '?callback=?';
  if (exists) {
    $.getJSON(url+suffix, function(data) {
      callback(channel, logo, data);
    });
  } else {
    callback(channel, logo, 404);
  }
};

twitch.fetchStreamer('ESL_SC2', twitch.fetchJSON);
twitch.fetchStreamer('freecodecamp', twitch.fetchJSON);
twitch.fetchStreamer('cretetion', twitch.fetchJSON);
twitch.fetchStreamer('brunofin', twitch.fetchJSON);
twitch.fetchStreamer('comster404', twitch.fetchJSON);

