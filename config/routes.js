const express           = require('express');
const router            = express.Router();

const statics           = require('../controllers/statics');
const registrations     = require('../controllers/registrations');
const sessions          = require('../controllers/sessions');
const users             = require('../controllers/users');
const restaurants       = require('../controllers/restaurants'); //added
const menuItems         = require('../controllers/menuItems'); //added

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

router.route('/restaurants/:restaurantId')
.get(restaurants.show)
.post(menuItems.create)
.put(menuItems.update);

// router.route('/restaurants')
// .post(menuItems.update);

router.route('/restaurants/:restaurantId/menuItems/new')
.get(menuItems.new);

module.exports = router;
