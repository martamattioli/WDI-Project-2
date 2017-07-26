// var menuApp = menuApp || {};

/* global google:ignore */

function init() {
  initMap();

  $('input[type="radio"]').on('click', () => {
    if ($('#showUpvote').is(':checked')) {
      $('#upvotes').val(1);
      $('#downvotes').val(0);
    } else if ($('#showDownvote').is(':checked')) {
      $('#upvotes').val(0);
      $('#downvotes').val(1);
    }
  });

  $('.votes').one('click', updateVotes);
}

function updateVotes(e) {
  const isUserLoggedIn = parseInt($('nav li:nth-child(2)').attr('data-value'));

  const whatButtonDidIClick = $(e.target).attr('id');
  const inputSiblings = $(e.target).siblings('input');
  const inputSiblingUp = inputSiblings[0];
  const inputSiblingDown = inputSiblings[1];

  if(isUserLoggedIn === 1) { //if user is not logged in
    $('main').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>You must be logged in to vote an item!</div>');
  } else if (isUserLoggedIn === 0) { //if user is logged in
    if (whatButtonDidIClick === 'upvote' && $(inputSiblingUp).attr('value') === 'false' || whatButtonDidIClick === 'downvote' && $(inputSiblingDown).attr('value') === 'false') {
      $('main').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>You cannot double-vote!</div>');
    } else {
      const newValue = parseInt($(e.target).text()) + 1;
      var restID = $('#restId')[0].innerHTML;
      var elmID = $(e.target).siblings('div')[0].innerHTML;
      var upvts = parseInt($(e.target).siblings('div')[1].innerHTML);
      var dwnvts = parseInt($(e.target).siblings('div')[2].innerHTML);
      if ($(e.target).attr('id') === 'upvote') {
        var objToSend = {
          id: elmID,
          upvotes: parseInt(upvts + 1)
        };
      } else if ($(e.target).attr('id') === 'downvote') {
        var objToSend = {
          id: elmID,
          downvotes: parseInt(dwnvts + 1)
        };
      }
      $
      .ajax({
        url: `${window.location.origin}/restaurants/${restID}`,
        type: 'PUT',
        data: objToSend,
        success: function(data) {
          // console.log(data);
        }
      });
      $(e.target).text(newValue);
    }

    // const newValue = parseInt($(e.target).text()) + 1;
    // var restID = $('#restId')[0].innerHTML;
    // var elmID = $(e.target).siblings('div')[0].innerHTML;
    // var upvts = parseInt($(e.target).siblings('div')[1].innerHTML);
    // var dwnvts = parseInt($(e.target).siblings('div')[2].innerHTML);
    // if ($(e.target).attr('id') === 'upvote') {
    //   var objToSend = {
    //     id: elmID,
    //     upvotes: parseInt(upvts + 1)
    //   };
    // } else if ($(e.target).attr('id') === 'downvote') {
    //   var objToSend = {
    //     id: elmID,
    //     downvotes: parseInt(dwnvts + 1)
    //   };
    // }
    // $
    // .ajax({
    //   url: `${window.location.origin}/restaurants/${restID}`,
    //   type: 'PUT',
    //   data: objToSend,
    //   success: function(data) {
    //     // console.log(data);
    //   }
    // });
    // $(e.target).text(newValue);
  }
}

function initMap() {
  // console.log(this);
  const input = document.getElementById('pac-input');


  const autocomplete = new google.maps.places.Autocomplete(input, { types: [ 'establishment' ]});

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

    // $('#pac-input').attr('value',`${place.name}`);

    // console.log(place);
    var newVenue = { name: place.name, restaurantId: place.place_id, websiteURL: place.website, types: place.types, priceLevel: place.price_level, rating: place.rating, address: place.formatted_address, phoneNumber: place.international_phone_number };
    $.ajax({
      url: '/restaurants/new',
      method: 'POST',
      data: newVenue,
      success: function(data){
        location.href = `${location.origin}/restaurants/${data.restaurantId}`;
      }
    });

    //$.post('/restaurants/new', newVenue)
  });
}


$(init);
