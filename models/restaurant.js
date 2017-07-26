const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({ //the way I access the commentSchema, I need to go through the parent schema where it is embedded into
  body: String,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' } //here I want to reference which user added which comment
});

const menuItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemCategory: String,
  price: Number,
  photos: String,
  otherOptions: String,
  upvotes: Number,
  downvotes: Number,
  upvoteHistory: [{ type: String }],
  downvoteHistory: [{ type: String }],
  comments: [commentSchema]
});

menuItemSchema.methods.hasVoted = function(voteType, userID){
  if(voteType === 'upvote'){
    return this.upvoteHistory.includes(userID.toString());
  } else {
    return this.downvoteHistory.includes(userID.toString());
  }
};


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
