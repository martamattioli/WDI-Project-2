// const Restaurant = require('../models/restaurant');
//
// //INDEX
// function restaurantsIndex(req, res) {
//   Restaurant
//     .find()
//     .exec()
//     .then(restaurants => {
//       res.render('restaurants/index', { restaurants });
//     })
//     .catch(err => {
//       res.status(500).render('error', { error: err });
//     });
// }
//
// // SHOW
// function restaurantShow(req, res) {
//   Restaurant
//     .findById(req.params.id)
//     .exec()
//     .then(restaurant => {
//       if (!restaurant) return res.status(404).render('error', { error: 'No restaurant found.'});
//       res.render('cities/show', { restaurant });
//     })
//     .catch(err => {
//       res.status(500).render('error', { error: err });
//     });
// }
//
// module.exports = {
//   index: restaurantsIndex,
//   show: restaurantShow
// };
