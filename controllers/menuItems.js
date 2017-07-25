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

function menuItemsUpdate(req, res) {
  // console.log('*********************** HIT!');
  // console.log(req.params.restaurantId);
  // console.log('MENU ITEM ID **************' + req.body.id);
  Restaurant
  .findById(req.params.restaurantId)
  .exec()
  .then((restaurant) => {
    var menuItems = restaurant.menuItem.find(obj => obj._id == req.body.id);
    if (req.body.upvotes) {
      console.log('**************UPVOTED!!!!');
      console.log(menuItems.upvoteHistory);
      menuItems.upvoteHistory.forEach(item => {
        if (String(req.session.userId) === String(item)) {
          console.log('cannot vote twice!');
        } else {
          console.log('NO UPVOTES YET');
          menuItems.upvotes = req.body.upvotes;
          //push the user id into the array of upvotes
          menuItems.upvoteHistory.push(`${req.session.userId}`);
        }
      });
      // console.log(menuItems.upvoteHistory);
    } else {
      menuItems.downvoteHistory.forEach(item => {
        if (String(req.session.userId) === String(item)) {
          console.log('cannot vote twice!');
        } else {
          menuItems.downvotes = req.body.downvotes;
          //push the user id into the array of upvotes
          menuItems.downvoteHistory.push(`${req.session.userId}`);
        }
      });
    }
    restaurant.save();
    console.log('AFTER ADJUSTMENT **************  ' + restaurant);
  });
}

module.exports = {
  new: menuItemsNew,
  create: menuItemsCreate,
  update: menuItemsUpdate
};
