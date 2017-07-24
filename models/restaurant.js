const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  restaurantId: String,
  websiteURL: String,
  types: [ { type: String } ],
  priceLevel: Number,
  rating: Number,
  address: String,
  phoneNumber: String
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
