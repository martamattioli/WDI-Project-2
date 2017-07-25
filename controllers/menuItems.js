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

// findByIdAndUpdate(req.params.id, req.body)

function menuItemsUpdate(req, res) {
  console.log('*********************** HIT!');
  console.log(req.params.restaurantId);
  console.log('MENU ITEM ID **************' + req.body.id);
  Restaurant
  .findById(req.params.restaurantId)
  .exec()
  .then((restaurant) => {
    console.log(restaurant.menuItem.find(obj => obj._id == req.body.id));
    if (req.body.upvotes) {
      restaurant.menuItem.find(obj => obj._id == req.body.id).upvotes = req.body.upvotes;
    } else {
      restaurant.menuItem.find(obj => obj._id == req.body.id).downvotes = req.body.downvotes;
    }
    restaurant.save();
    console.log('AFTER ADJUSTMENT **************  ' + restaurant);
    //     if(!restaurant) return res.status(404).render('statics/404');
    //
    //     for(const field in req.body) {
    //       restaurant[field] = req.body[field];
    //     }
    //     return restaurant.save();

  });
  //   .then((restaurant) => {
  //     console.log(restaurant.menuItem);
  //     res.redirect(`/restaurants/${restaurant.restaurantId}`);
  //   });
}

module.exports = {
  new: menuItemsNew,
  create: menuItemsCreate,
  update: menuItemsUpdate
};
