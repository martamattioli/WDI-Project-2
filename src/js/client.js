var menuApp = menuApp || {};

/* global google:ignore */

menuApp.init = function() {
  this.initMap();
};

menuApp.initMap = function() {
  console.log(this);
  this.input = document.getElementById('pac-input');


  this.autocomplete = new google.maps.places.Autocomplete(menuApp.input, { types: [ 'establishment' ]});

  // Set initial restrict to the greater list of countries.
  this.autocomplete.setComponentRestrictions({
    'country': ['uk']
  });

  this.autocomplete.addListener('place_changed', function() {
    var place = menuApp.autocomplete.getPlace();
    if (!place.geometry) {
      window.alert('Select a restaurant');
      return;
    }

    menuApp.searchInput = `${place.place_id}`;

    // $
    //   .get(`http://localhost:3000/restaurants/${menuApp.searchInput}`)
    //   .fail(() => console.log('error'));
  });
};

$(menuApp.init.bind(menuApp));

// module.exports = {
//   searchInput: menuApp.searchInput
// };
