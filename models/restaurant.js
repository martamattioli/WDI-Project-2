const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  restaurantId: String
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
