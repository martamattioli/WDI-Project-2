// var menuApp = menuApp || {};

/* global google:ignore */


function init() {
  ifHasLoggedIn();

  ifIsOnHomepage();
  ifIsOnRegisterPage();
  ifOnForm();

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

  $('.votes').on('click', updateVotes);

  calculateScoreAndSort();
}

function ifOnForm() {
  if($('.main-forms').length > 0) {
    $('body').css('background-color', '#d65b49');
  }
}

function ifIsOnRegisterPage() {
  if($('.register-page').length > 0){
    $('#login-home-form').css('display', 'none');
    $('.the-whole-website').css('display', 'block');
  }
}

function ifIsOnHomepage() {
  if($('.search-bar-home').length === 0){  // return's true if element is present
  // show or hide another div
  $('<li><div id="locationField"><form id="searchForm" action="" method="GET"><input id="pac-input" class="controls" type="text" placeholder="Enter a location" value=""/></form></div>').appendTo($('nav ul'));
}
}

function ifHasLoggedIn() {
  const isUserLoggedIn = parseInt($('nav li:nth-child(2)').attr('data-value'));
  if (isUserLoggedIn === 0) {
    $('#login-home-form').remove();
    $('.logo-div').remove();
    $('.the-whole-website').css('display', 'block');
    $('nav').css('display', 'block');
    if ($('.edit-user-info').length > 0) {
      $('<div class="row logo-div"><div class="col-12"><a href="/"><img src="/images/logo.svg" alt="Taste the Menu Logo" class="img-responsive"></a></div></div>').prependTo($('main'));
      $('nav').remove();
    }
  }
}

function calculateScoreAndSort() {
  const menuList = $('#menu li');

  menuList.each((list) => {
    const voteButton = $(menuList[list]).children('button');
    const upVoteButtonValue = parseInt(($($(voteButton)[0]).text()));
    const downVoteButtonValue = parseInt(($($(voteButton)[1]).text()));
    $(menuList[list]).attr('data-score', `${upVoteButtonValue - downVoteButtonValue}`);
  });

  menuList.sort(function (a, b) {
    return +b.getAttribute('data-score') - +a.getAttribute('data-score');
  }).appendTo($('#menu'));
}

function youNeedToLogInMsg() {
  $('main').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>You must be logged in to vote an item!</div>');
}

function cannotDoubleVoteMsg() {
  $('main').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>You cannot double-vote!</div>');
}

function updateVotes(e) {
  const isUserLoggedIn = parseInt($('nav li:nth-child(2)').attr('data-value'));

  const whatButtonDidIClick = $(e.target).attr('id');
  const inputSiblings = $(e.target).siblings('input');
  const inputSiblingUp = inputSiblings[0];
  const inputSiblingDown = inputSiblings[1];
  const otherButton = $(e.target).siblings('button')[0];
  const otherButtonValue = parseInt($($(e.target).siblings('button')[0]).text());

  function addVoteAndSaveDb() {
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

  if(isUserLoggedIn === 1) { //if user is not logged in
    youNeedToLogInMsg();
  } else if (isUserLoggedIn === 0) { //if user is logged in
    if (whatButtonDidIClick === 'upvote' && $(inputSiblingUp).attr('value') === 'false' || whatButtonDidIClick === 'downvote' && $(inputSiblingDown).attr('value') === 'false') {
      cannotDoubleVoteMsg();
    } else {
      if (whatButtonDidIClick === 'upvote' && $(inputSiblingUp).attr('value') === 'true' && whatButtonDidIClick === 'downvote' && $(inputSiblingDown).attr('value') === 'true') {
        addVoteAndSaveDb();
        calculateScoreAndSort();
      } else {
        addVoteAndSaveDb();
        $(otherButton).text(otherButtonValue - 1);
        if (whatButtonDidIClick === 'upvote') {
          $(inputSiblingDown).attr('value', 'true');
          $(inputSiblingUp).attr('value', 'false');
        } else {
          $(inputSiblingDown).attr('value', 'false');
          $(inputSiblingUp).attr('value', 'true');
        }
        calculateScoreAndSort();
      }
    }
  }
}

function initMap() {
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

    // $(place.photos).each(photo => {
    //   console.log(place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}));
    // });

    // console.log(place.photos[0].getUrl({'maxWidth': 500, 'maxHeight': 500}));

    var newVenue = { name: place.name, restaurantId: place.place_id, websiteURL: place.website, types: place.types, priceLevel: place.price_level, rating: place.rating, address: place.formatted_address, phoneNumber: place.international_phone_number, photo: place.photos[0].getUrl({'maxWidth': 500, 'maxHeight': 500})};
    $.ajax({
      url: '/restaurants/new',
      method: 'POST',
      data: newVenue,
      success: function(data){
        location.href = `${location.origin}/restaurants/${data.restaurantId}`;
      }
    });
  });
}


$(init);
