const Restaurant = require('../models/restaurant');

function commentsCreate(req, res) {
  Restaurant
  .findById(req.params.restaurantId)
  .exec()
  .then((restaurant) => {
    if(!restaurant) return res.status(404).render('statics/404');

    const menuItem = restaurant.menuItem.id(req.params.menuItemId);
    req.body.user = req.session.userId;
    menuItem.comments.push(req.body);
    restaurant.save();
  })
  .then(() => {
    Restaurant
    .findById(req.params.restaurantId)
    .populate('menuItem.comments.user')
    .exec()
    .then(restaurant => {
      if(!restaurant) return res.status(404).render('statics/404');

      res.redirect(`/restaurants/${restaurant.restaurantId}`);
    });
  });

}

function commentsDelete(req, res) {
  Restaurant
  .findById(req.params.restaurantId)
  .exec()
  .then((restaurant) => {
    if(!restaurant) return res.status(404).render('statics/404');

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
