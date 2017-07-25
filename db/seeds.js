const mongoose = require('mongoose');
const bluebird = require('bluebird');

const db = process.env.MONGODB_URI || 'mongodb://localhost/wdi-project-2';
mongoose.connect(db);
mongoose.Promise = bluebird;

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
    passwordConfirmation: 'cat',
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
