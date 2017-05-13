/**
 * weather.js
 *
 * 1. Get the latitude and longitude
 * 2. Get the weather
 * 3. Update the page with weather information
*/

$(document).ready(function() {

  'use strict';

  var units = 'F';

  // =================  DECLARE LOCATION PROMISE  ==============
  var fetchLocation = new Promise( function(resolve) {
    navigator.geolocation.getCurrentPosition(function(position) {
      resolve(position.coords);
    }, function(err) {
      console.warn("Error (" + err.code + "): " + err.message);
    });
  })

  // =================  FETCH WEATHER  =========================
  fetchLocation
    .then(function(coords) {
      return new Promise(function(resolve) {
        var lat = coords.latitude,
            lon = coords.longitude,
            baseUrl = "http://forecast.weather.gov/MapClick.php",
            fullUrl = baseUrl  + "?lat=" + lat
                               + "&lon=" + lon
                               + "&FcstType=json";

        // The main use of jQuery is the AJAX request
        // $.getJSON(fullUrl, function(response) {
        //   resolve(response.currentobservation);
        // });

        $.ajax({
          dataType: "json",
          url: fullUrl,
          success: function(response) {
            resolve(response.currentobservation);
          }
        });

      });
    })
    .then(function(weather) { // weather = new Promise();
      var name        = weather.name,
          date        = weather.Date,
          temp        = weather.Temp,
          conditions  = weather.Weather,
          icon        = weather.Weatherimage,
          iconUrl     = "http://forecast.weather.gov/newimages/medium/",
          nameElement = document.getElementById("location"),
          dateElement = document.getElementById("date"),
          tempElement = document.getElementById("temperature"),
          condElement = document.getElementById("weather"),
          iconElement = document.getElementById("weather-icon");

          nameElement.innerHTML = name;
          dateElement.innerHTML = date;
          tempElement.innerHTML = round(temp,1) + "&deg; " + units;
          condElement.innerHTML = conditions;
          iconElement.src       = iconUrl + icon;
    })
    .catch(function(err) {
      console.log(err);
    });

  // ================  UNITS BUTTON  ===================
  $("#temperature").on("click", function () {
     var tempString = document.getElementById("temperature").innerHTML,
         temp = parseFloat(tempString);
     if ( units == 'F' ) {
       units = 'C';
       temp = temp * 5 / 9 + 32;
     }
     else {
       units = 'F';
       temp = (temp - 32) * 9 / 5;
     }
    console.log("on click - new units: " + temp + units);
    document.getElementById("temperature").innerHTML = round(temp,1) + "&deg; " + units;
  });

  // Function for Decimal Rounding
  // Doesn't handle bogus values!!!
  var round = function(num, places) {
    var bump = Math.pow(10,places);
    return Math.round(num*bump)/bump;
  }
});



