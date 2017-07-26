const Restaurant = require('../models/restaurant');

// Now that I have the data from the front end - Field of schema need to match schema of object - I only want to create something if it doesn't already exists (Find by ID for the place place_id) - create item

function restaurantsCreate(req, res) {

  Restaurant
    .findOne({ restaurantId: req.body.restaurantId })
    .exec()
    .then(restaurant => {
      if(!restaurant) {
        Restaurant
          .create(req.body)
          .then(restaurant => {
            res.send(restaurant);
          })
          .catch(err => {
            res.status(500).send(err);
          });
      } else {
        res.send(restaurant);
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

// SHOW
function restaurantsShow(req, res) {
  //if the restaurant with the searched id doesn't exists,
  //create it
  //show it to me
  Restaurant
    .findOne({restaurantId: req.params.restaurantId})
    .populate('menuItem.comments.user')
    .exec()
    .then(restaurant => {
      if (!restaurant) return res.status(404).send('Page not found');
      res.render('restaurants/show', { restaurant });
    })
    .catch(err => {
      res.status(500).render('error', { error: err });
    });
}

module.exports = {
  create: restaurantsCreate,
  show: restaurantsShow
};
