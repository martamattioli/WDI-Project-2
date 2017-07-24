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

    $.post( `http://localhost:3000/restaurants/new`, { name: place.name, restaurantId: place.place_id } );

    $('#pac-input').attr('value',`${place.name}`);

    $('#searchForm').on('submit', () => {
      $('#searchForm').attr('action', `/restaurants/${place.place_id}`);
    });
  });
};



$(menuApp.init.bind(menuApp));
