const express           = require('express');
const router            = express.Router();

const statics           = require('../controllers/statics');
const registrations     = require('../controllers/registrations');
const sessions          = require('../controllers/sessions');
// const restaurants    = require('../controllers/restaurants'); //added

router.route('/')
  .get(statics.homepage);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

// router.route('/restaurants')
//   .get(restaurants.index);
//
// router.route('/restaurants/:id') //added
//   .get(restaurants.show); //added

module.exports = router;
