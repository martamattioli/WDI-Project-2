var menuApp = menuApp || {};

/* global google:ignore */

menuApp.init = function() {
  this.initMap();

  $('input[type="radio"]').on('click', () => {
    if ($('#showUpvote').is(':checked')) {
      $('#upvotes').val(1);
      $('#downvotes').val(0);
    } else if ($('#showDownvote').is(':checked')) {
      $('#upvotes').val(0);
      $('#downvotes').val(1);
    }
  });
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

    $.post( `http://localhost:3000/restaurants/new`, { name: place.name, restaurantId: place.place_id, websiteURL: place.website, types: place.types, priceLevel: place.price_level, rating: place.rating, address: place.formatted_address, phoneNumber: place.international_phone_number });

    $('#pac-input').attr('value',`${place.name}`);

    $('#searchForm').on('submit', () => {
      $('#searchForm').attr('action', `/restaurants/${place.place_id}`);
    });
  });
};


$(menuApp.init.bind(menuApp));
