const Restaurant = require('../models/restaurant');

function commentsCreate(req, res) {
  Restaurant
  .findById(req.params.restaurantId)
  .exec()
  .then((restaurant) => {
    const menuItem = restaurant.menuItem.find(obj => obj.id);
    menuItem.comments.push(req.body);
    restaurant.save();
    res.redirect(`/restaurants/${restaurant.restaurantId}`);
  });
}

function commentsDelete(req, res) {
  Restaurant
  .findById(req.params.restaurantId)
  .exec()
  .then((restaurant) => {
    const menuItem = restaurant.menuItem.find(obj => obj.id);
    const comment = menuItem.comments.find(obj => obj.id);
    comment.remove();
    restaurant.save();
    res.redirect(`/restaurants/${restaurant.restaurantId}`);
  })
  .catch(err => {
    res.status(500).send(err);
  });
}

module.exports = {
  create: commentsCreate,
  delete: commentsDelete
};
