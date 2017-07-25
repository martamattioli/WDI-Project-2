const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, unique: true },
  itemCategory: String,
  price: Number,
  photos: String,
  otherOptions: String,
  upvotes: Number,
  downvotes: Number,
  upvoteHistory: [{ type: String }],
  downvoteHistory: [{ type: String }]
});

const restaurantSchema = new mongoose.Schema({
  name: String,
  restaurantId: String,
  websiteURL: String,
  types: [ { type: String } ],
  priceLevel: Number,
  rating: Number,
  address: String,
  phoneNumber: String,
  menuItem: [ menuItemSchema ]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
