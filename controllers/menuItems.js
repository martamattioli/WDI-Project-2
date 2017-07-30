const Restaurant = require('../models/restaurant');
const itemCategories = [
  'Starter',
  'Main Course',
  'Side Dish',
  'Dessert'
];

function menuItemsNew(req, res) {
  Restaurant
  .findOne({ restaurantId: req.params.restaurantId })
  .exec()
  .then(restaurant => {
    if(!restaurant) return res.status(404).render('statics/404');
    res.render('menuItems/new', { restaurant, itemCategories });
  });
}

function menuItemsCreate(req, res) {
  Restaurant
  .findOne({ restaurantId: req.params.restaurantId })
  .exec()
  .then(restaurant => {
    if(!restaurant) return res.status(404).render('statics/404');

    req.body.upvoteHistory = [];
    req.body.downvoteHistory = [];
    if (req.body.upvotes > 0)
      req.body.upvoteHistory.push(req.session.userId);
    else
      req.body.downvoteHistory.push(req.session.userId);
    restaurant.menuItem.push(req.body);
    restaurant.save(); //because I'm not running update, so I have to run save, in order to save changes in the database
    res.redirect(`/restaurants/${restaurant.restaurantId}`);
  });
}

function menuItemsUpdate(req, res) {
  // a single user can upvote or downvote
  // only once for each option
  // if a user chose one option already, he/she can only choose the other option
  Restaurant
  .findById(req.params.restaurantId)
  .exec()
  .then((restaurant) => {
    if(!restaurant) return res.status(404).render('statics/404');

    var menuItem = restaurant.menuItem.find(obj => obj._id == req.body.id);
    // HAS THE USER VOTED BEFORE?
    let hasVotedUpvote = menuItem.upvoteHistory.includes(req.session.userId.toString())
    let hasVotedDownvote = menuItem.downvoteHistory.includes(req.session.userId.toString())

    if(req.body.upvotes){ // voted up
      //I Need to access the number of upvotes for that menu item
      if(!menuItem.upvoteHistory.includes(req.session.userId.toString())){ // then user hasn't already voted up
        menuItem.upvoteHistory.push(req.session.userId);
        menuItem.upvotes += 1;
        if(hasVotedDownvote){
          menuItem.downvotes -= 1;
          checkIfinArrayandSplice(req.session.userId, menuItem.downvoteHistory);
        }
      }
    } else if(req.body.downvotes){ // voted down
      //I Need to access the number of downvotes for that menu item
      if(!menuItem.downvoteHistory.includes(req.session.userId.toString())){ // then user hasn't already voted down
        menuItem.downvoteHistory.push(req.session.userId);
        menuItem.downvotes += 1;
        if(hasVotedUpvote){
          menuItem.upvotes -= 1;
          checkIfinArrayandSplice(req.session.userId, menuItem.upvoteHistory);
        }
      }
    }
    restaurant.save();
  });
}

function checkIfinArrayandSplice(toCheck, array) {
  for (var i = 0; i < array.length; i++) {
    if (String(toCheck) === String(array[i])) {
      array.splice(i, 1);
    }
  }
}

function menuItemsEdit(req, res, next) {
  Restaurant
    .findById(req.params.restaurantId)
    .then((restaurant) => {
      if(!restaurant) return res.status(404).render('statics/404');
      const menuItem = restaurant.menuItem.id(req.params.menuItemId);

      res.render('menuItems/edit', { restaurant, menuItem, itemCategories });
    })
    .catch(next);
}

function menuAdminUpdate(req, res) {
  Restaurant
    .findOne({ restaurantId: req.params.restaurantId })
    .then((restaurant) => {
      if(!restaurant) return res.status(404).render('statics/404');

      const menuItem = restaurant.menuItem.id(req.params.menuItemId);

      for(const field in req.body) {
        menuItem[field] = req.body[field];
      }

      return restaurant.save();
    })
    .then((restaurant) => res.redirect(`/restaurants/${restaurant.restaurantId}`))
    .catch(err => {
      res.status(500).send(err);
    });
}

function menuAdminDelete(req, res) {
  Restaurant
    .findById(req.params.restaurantId)
    .then((restaurant) => {
      if(!restaurant) return res.status(404).render('statics/404');

      const menuItem = restaurant.menuItem.id(req.params.menuItemId);

      menuItem.remove();

      restaurant.save();
      res.redirect(`/restaurants/${restaurant.restaurantId}`);

    })
    .catch(err => {
      res.status(500).send(err);
    });
}

module.exports = {
  new: menuItemsNew,
  create: menuItemsCreate,
  update: menuItemsUpdate,
  edit: menuItemsEdit,
  adminUpdate: menuAdminUpdate,
  adminDelete: menuAdminDelete
};
