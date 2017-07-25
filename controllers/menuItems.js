const Restaurant = require('../models/restaurant');
const itemCategories = [
  'Breakfast',
  'Appetizer',
  'Main Course',
  'Dessert'
];

function menuItemsNew(req, res) {
  Restaurant
  .findOne({ restaurantId: req.params.restaurantId })
  .exec()
  .then(restaurant => {
    res.render('menuItems/new', { restaurant, itemCategories });
  });
}

function menuItemsCreate(req, res) {
  Restaurant
  .findOne({ restaurantId: req.params.restaurantId })
  .exec()
  .then(restaurant => {
    if (req.body.upvotes > 0) {
      req.body.upvoteHistory = [];
      req.body.upvoteHistory.push(req.session.userId);
      req.body.downvoteHistory = ['blank'];
    } else {
      req.body.downvoteHistory = [];
      req.body.downvoteHistory.push(req.session.userId);
      req.body.upvoteHistory = ['blank'];
    }
    restaurant.menuItem.push(req.body);
    restaurant.save(); //because I'm not running update, so I have to run save, in order to save changes in the database
    // console.log(`After I add new menu item ${restaurant}`);
    console.log(restaurant);
    res.redirect(`/restaurants/${restaurant.restaurantId}`);
  });
}

let hasVotedUpvote;
let hasVotedDownvote;

function menuItemsUpdate(req, res) {
  // console.log('*********************** HIT!');
  // console.log(req.params.restaurantId);
  // console.log('MENU ITEM ID **************' + req.body.id);
  Restaurant
  .findById(req.params.restaurantId)
  .exec()
  .then((restaurant) => {
    var menuItems = restaurant.menuItem.find(obj => obj._id == req.body.id);
    //HAS THE USER VOTED BEFORE?

    menuItems.upvoteHistory.forEach(item => {
      if (String(req.session.userId) === String(item)) {
        hasVotedUpvote = true;
        hasVotedDownvote = false;
      }
      console.log(`UPVOTEHISTORY HAS UPVOTED: ${hasVotedUpvote}`);
      console.log(`UPVOTEHISTORY HAS DOWNVOTED: ${hasVotedDownvote}`);
    });

    menuItems.downvoteHistory.forEach(item => {
      if (String(req.session.userId) === String(item)) {
        hasVotedDownvote = true;
        hasVotedUpvote = false;
      }
      console.log(`DOWNVOTEHISTORY HAS UPVOTED: ${hasVotedUpvote}`);
      console.log(`DOWNVOTEHISTORY HAS DOWNVOTED: ${hasVotedDownvote}`);
    });

    ////////////////////////////////////////////////////////////
    //*************IF THE USER VOTED BEFORE*******************//
    //IT MEANS THAT EITHER hasVotedDownvote OR downvoteHistory ARE TRUE
    if (hasVotedDownvote || hasVotedUpvote) {
      if (req.body.upvotes) {
        console.log('**************UPVOTED BUT HAS VOTED BEFORE [V4]!!!!');
        menuItems.upvoteHistory.forEach(item => {
          if (String(req.session.userId) === String(item)) {
            console.log('[V4] cannot vote twice!');
          } else {
            console.log('[V4] NO UPVOTES YET');
            menuItems.upvotes = req.body.upvotes;
            menuItems.upvoteHistory.push(`${req.session.userId}`); //push the user id into the array of upvotes

            menuItems.downvotes = menuItems.downvotes - 1; //toggle the downvotes
            //splice the id of the user from the array of upvotes
            checkIfinArrayandSplice(req.session.userId, menuItems.downvoteHistory);
            console.log(`[v4]DOWNVOTES ARRAY::::::::`);
            console.log(menuItems.downvoteHistory);
            console.log(`[v4]UPVOTES ARRAY::::::::`);
            console.log(menuItems.upvoteHistory);
            hasVotedUpvote = true;
            hasVotedDownvote = false;
          }
        });
        // console.log(menuItems.upvoteHistory);
      } else {
        console.log('**************DOWNVOTED BUT HAS VOTED BEFORE [V3]!!!!');
        console.log(menuItems.downvotes);
        menuItems.downvoteHistory.forEach(item => {
          if (String(req.session.userId) === String(item)) {
            console.log(item);
            console.log('[V3] cannot vote twice!');
          } else {
            console.log('[V3] NO UPVOTES YET');
            menuItems.downvotes = req.body.downvotes;
            menuItems.downvoteHistory.push(`${req.session.userId}`); //push the user id into the array of downvotes

            menuItems.upvotes = menuItems.upvotes - 1; //toggle the upvotes
            //splice the id of the user from the array of upvotes
            checkIfinArrayandSplice(req.session.userId, menuItems.upvoteHistory);
            console.log(`[v3]UPVOTES ARRAY::::::::`);
            console.log(menuItems.upvoteHistory);
            console.log(`[v3]DOWNVOTES ARRAY::::::::`);
            console.log(menuItems.downvoteHistory);
            hasVotedUpvote = false;
            hasVotedDownvote = true;
          }
        });
      }
    } else if (hasVotedDownvote === false && hasVotedUpvote === false) {
      ////////////////////////////////////////////////////////////
      //**********IF THE USER DID NOT VOTE BEFORE***************//
      if (req.body.upvotes) {
        console.log('**************UPVOTED 1ST TIME [V2]!!!!');
        console.log(menuItems.upvoteHistory);
        menuItems.upvoteHistory.forEach(item => {
          if (String(req.session.userId) === String(item)) {
            console.log('[V2] cannot vote twice!');
          } else {
            console.log('[V2] NO UPVOTES YET');
            menuItems.upvotes = req.body.upvotes;
            //push the user id into the array of upvotes
            menuItems.upvoteHistory.push(`${req.session.userId}`);
          }
        });
        // console.log(menuItems.upvoteHistory);
      } else {
        console.log('**************DOWNVOTED 1ST TIME!!!! [V1]');
        menuItems.downvoteHistory.forEach(item => {
          console.log('[V2] NO DOWNVOTES YET');
          if (String(req.session.userId) === String(item)) {
            console.log('[V1] cannot vote twice!');
          } else {
            menuItems.downvotes = req.body.downvotes;
            //push the user id into the array of upvotes
            menuItems.downvoteHistory.push(`${req.session.userId}`);
          }
        });
      }
    }


    restaurant.save();
    // console.log('AFTER ADJUSTMENT **************  ' + restaurant);
  });
}

function checkIfinArrayandSplice(toCheck, array) {
  for (var i = 0; i < array.length; i++) {
    if (String(toCheck) === String(array[i])) {
      array.splice(i, 1);
      console.log(array);
    }
  }
}

module.exports = {
  new: menuItemsNew,
  create: menuItemsCreate,
  update: menuItemsUpdate
};
