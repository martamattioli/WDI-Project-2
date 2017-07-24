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
      restaurant.menuItem.push(req.body);
      restaurant.save(); //because I'm not running update, so I have to run save, in order to save changes in the database
      console.log(`After I add new menu item ${restaurant}`);
      res.redirect(`/restaurants/${restaurant.restaurantId}`);
    });
}

module.exports = {
  new: menuItemsNew,
  create: menuItemsCreate
};
