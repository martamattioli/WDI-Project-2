// var menuApp = menuApp || {};

/* global google:ignore */


function init() {
  const itemCategoryArray = $('.item-category'); // item category section
  const imageCategoryArray = $('.image-category');

  const profilePicture = $('.profile-picture')[0];

  const marginOfSpan = $($('.profile-picture')[0]).width(); // menuItems comments section
  const totalMargin = marginOfSpan + 20;
  const restaurantType = $('#restaurant-type')[0];
  const restaurantTypeText = $(restaurantType).text();

  // show divs based on where you user is on website
  ifHasLoggedIn();
  ifIsOnRegisterPage();
  ifIsOnHomepage();
  ifOnForm();

  if (!restaurantTypeText.includes('restaurant')) {
    const menuContainer = $('.menu-container')[0];
    const addItemButton = $('.cancel-button')[0];
    const addItemSection = $('.add-item-section')[0];
    $(menuContainer).remove();
    $(addItemButton).remove();
    $('<h2 class="not-a-restaurant">This is not a restaurant I\'m afraid...</h2>').appendTo($(addItemSection));
  }

  if ($('.menu-item').length === 0) {
    $('<h2 class="no-items">No-one has added any menu items yet!</h2>').appendTo($('.menu-container'));
  } else {
    $('.no-items').remove();
  }

  if ($('.comment-picture').length > 0) {
    const commentPicture = $('.comment-picture');
    commentPicture.each(comment => {
      const marginOfSpan = $($('.comment-picture')[comment]).width();
      const totalMargin = marginOfSpan;
      $($('.comment-picture')[comment]).css('margin-right', `${totalMargin}px`);
    });
  }

  $(profilePicture).css('margin-right', `${totalMargin}px`);

  if ($(document.body).height() < $(window).height()) {
    $('footer').css({'position': 'fixed', 'bottom': '0px', 'width': '100%'});
  }

  switch (parseInt($('.rest-details-price').text())) {
    case 1:
      $('.rest-details-price').text('£');
      break;
    case 2:
      $('.rest-details-price').text('££');
      break;
    case 3:
      $('.rest-details-price').text('£££');
      break;
    case 4:
      $('.rest-details-price').text('££££');
      break;
    default:
      $('.rest-details-price').text('No info');
  }

  imageCategoryArray.each(function(category) {
    const imageCategory = $(imageCategoryArray[category]);
    const itemCategory = $(itemCategoryArray[category]);

    if(itemCategory.text() === 'Starter') {
      imageCategory.attr('src', '/images/starter-icon.svg');
    } else if(itemCategory.text() === 'Main Course') {
      imageCategory.attr('src', '/images/main-icon.svg');
    } else if(itemCategory.text() === 'Dessert') {
      imageCategory.attr('src', '/images/dessert-icon.svg');
    } else {
      imageCategory.attr('src', '/images/main-icon.svg');
    }
  });

  const critiques = $('.critiques');

  critiques.each(function(critique) {
    $($('.comment-section')[critique]).attr('data-value', critique);
  });

  $('.critiques').on('click', (e) => {
    $(e.target).parent().next().fadeIn();
  });
  $('.close-comment-section').on('click', (e) => {
    $(e.target).parent().fadeOut();
  });



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
    // $('#login-home-form').css('display', 'none');
    $('#login-home-form').remove();
    $('nav').remove();
    $('.the-whole-website').css('display', 'block');
  }
}

function ifIsOnHomepage() {
  if ($('.search-bar-home').length > 0 && $('.main-forms').length === 0) {
    $('body').css('background-image', 'url(/images/homepage-background.jpeg)');
  } else if($('.search-bar-home').length === 0){
    $('<form class="form-inline mr-2" style="display: inline-block;"><input id="pac-input" class="form-control mr-sm-2 controls" type="text" placeholder="Search restaurant..." value=""/></form>').insertAfter($('.navbar-nav'));
  }
}

function ifHasLoggedIn() {
  const isUserLoggedIn = parseInt($('#logout').attr('data-value'));
  if (isUserLoggedIn === 0) {
    $('#login-home-form').remove();
    $('.logo-div').remove();
    $('.the-whole-website').css('display', 'block');
    $('nav').css('display', 'block');
    if ($('.edit-user-info').length > 0 || $('.add-item-page').length > 0 || $('.not-found-page').length > 0 ) {
      $('<div class="row logo-div"><div class="col-12"><a href="/"><img src="/images/logo.svg" alt="Taste the Menu Logo" class="img-responsive"></a></div></div>').prependTo($('main'));
      $('nav').remove();
    }
  }
}

function calculateScoreAndSort() {
  const menuList = $('.item-voting-system');
  menuList.each((list) => {
    const voteButton = $(menuList[list]).children('.sort-this-out');
    const upVoteButtonValue = parseInt(($($(voteButton)[0]).text()));
    const downVoteButtonValue = parseInt(($($(voteButton)[1]).text()));
    $($('#menu li')[list]).attr('data-score', `${upVoteButtonValue - downVoteButtonValue}`);
  });

  $('#menu li').sort(function (a, b) {
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
  const isUserLoggedIn = parseInt($('#logout').attr('data-value'));

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
        location.reload();
        // calculateScoreAndSort();
      } else {
        addVoteAndSaveDb();
        location.reload();
        // $(otherButton).text(otherButtonValue - 1);
        // if (whatButtonDidIClick === 'upvote') {
        //   $(inputSiblingDown).attr('value', 'true');
        //   $(inputSiblingUp).attr('value', 'false');
        // } else {
        //   $(inputSiblingDown).attr('value', 'false');
        //   $(inputSiblingUp).attr('value', 'true');
        // }
        // calculateScoreAndSort();
      }
    }
  }
}

function initMap() {
  const input = document.getElementById('pac-input');

  var options = {
    types: ['establishment'],
    componentRestrictions: {country: 'uk'}
  };
  const autocomplete = new google.maps.places.Autocomplete(input, options);

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

    var newVenue = { name: place.name, restaurantId: place.place_id, websiteURL: place.website, types: place.types, priceLevel: place.price_level, rating: place.rating, address: place.formatted_address, phoneNumber: place.international_phone_number, photo: place.photos[0].getUrl({'maxWidth': 1920, 'maxHeight': 500})};
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
