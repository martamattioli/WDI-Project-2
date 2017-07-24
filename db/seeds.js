const mongoose = require('mongoose');
const bluebird = require('bluebird');

const db = process.env.MONGODB_URI || 'mongodb://localhost/wdi-project-2';
mongoose.connect(db);
mongoose.Promise = bluebird;

// const requestPromise = require('request-promise');

const User = require('../models/user');
const Restaurant = require('../models/restaurant');

User.collection.drop();
Restaurant.collection.drop();

User
  .create([{
    firstName: 'Marta',
    lastName: 'Mattioli',
    email: 'marta_mattio@hotmail.it',
    password: 'cat',
    photo: 'http://fillmurray.com/200/200'
  }])
  .then((users) => {
    console.log(`${users.length} users created`);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });

// requestPromise('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJt2EWWWQFdkgRNCbSCr4SdSY&key=AIzaSyDT0WLiFcMOg4LQBxdNbupG_XkKRSf_Q_8')
//   .then(htmlString => {
//     // console.log(htmlString); //--> the response from an api that I make a request to using request-promise will ALWAYS return JSON as a string
//
//     const json = JSON.parse(htmlString); //if we want to access the obj within the stringified JSON, we must convert the string of JSON into actual JSON
//     // console.log(json.result.name);
//     Restaurant.create({
//       name: json.result.name,
//       restaurantId: json.result.place_id
//     });
//
//     console.log(`${json.result.name} was saved`);
//   });
