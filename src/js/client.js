$(init);

/* global google:ignore */

function init() {
  initMap();
}

function initMap() {
  var input = document.getElementById('pac-input');


  var autocomplete = new google.maps.places.Autocomplete(input, { types: [ 'establishment' ]});

  // Set initial restrict to the greater list of countries.
  autocomplete.setComponentRestrictions({
    'country': ['uk']
  });

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert('Select a restaurant');
      return;
    }


    $(`<div>${place.name}</div>`).appendTo('#placeInfo');
  });
}
