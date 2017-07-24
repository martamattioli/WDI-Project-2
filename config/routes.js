const express           = require('express');
const router            = express.Router();

const statics           = require('../controllers/statics');
const registrations     = require('../controllers/registrations');
const sessions          = require('../controllers/sessions');
const users             = require('../controllers/users');
// const placeInput        = require('../src/js/client');
const restaurants       = require('../controllers/restaurants'); //added

router.route('/')
  .get(statics.homepage);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

router.route('/users/:id')
  .get(users.show)
  .put(users.update);

router.route('/users/:id/edit')
  .get(users.edit);

router.route('/restaurants/new')
  .post(restaurants.create);

router.route('/restaurants/:restaurantId') //added
  .get(restaurants.show); //added

module.exports = router;
