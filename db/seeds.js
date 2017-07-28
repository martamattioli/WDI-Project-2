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
  }, {
    firstName: 'Giosue',
    lastName: 'Carraro',
    email: 'g@gmail.com',
    password: 'g',
    passwordConfirmation: 'g',
    photo: 'http://lorempixel.com/200/200/abstract'
  }, {
    firstName: 'Roger',
    lastName: 'Rabbit',
    email: 'm@gmail.com',
    password: 'm',
    passwordConfirmation: 'm',
    photo: 'https://i2.wp.com/www.tor.com/wp-content/uploads/2015/10/RogerRabbit08.jpg?fit=0%2C%209999&crop=0%2C0%2C100%2C100'
  }, {
    firstName: 'Joe',
    lastName: 'Allison',
    email: 'j@gmail.com',
    password: 'j',
    passwordConfirmation: 'j',
    photo: 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/3/000/098/2d3/099a536.jpg'
  }, {
    firstName: 'Bugs',
    lastName: 'Bunny',
    email: 'b@gmail.com',
    password: 'b',
    passwordConfirmation: 'b',
    photo: 'https://cdn.vox-cdn.com/thumbor/TiwabydzgLgAVBjjJvAO_dnKo_o=/0x16:1103x751/1200x800/filters:focal(0x16:1103x751)/cdn.vox-cdn.com/uploads/chorus_image/image/46840054/Screenshot_2015-07-27_15.11.13.0.0.png'
  }, {
    firstName: 'Daffy',
    lastName: 'Duck',
    email: 'd@gmail.com',
    password: 'd',
    passwordConfirmation: 'd',
    photo: 'http://plataoplomo.wtf/forum/uploads/monthly_2016_07/lucas1.jpg.d610bd210b51d64147b57a7c7fb8a103.jpg'
  }, {
    firstName: 'Willy',
    lastName: 'Coyote',
    email: 'w@gmail.com',
    password: 'w',
    passwordConfirmation: 'w',
    photo: 'https://hollywoodhatesme.files.wordpress.com/2010/09/wile-e-coyote.jpg'
  }, {
    firstName: 'Bip Bip',
    lastName: 'Bip',
    email: 'bip@gmail.com',
    password: 'b',
    passwordConfirmation: 'b',
    photo: 'http://www.desenhoswiki.com/Uploads/desenhoswiki.com/ImagensGrandes/bip-bip-1.jpg'
  }, {
    firstName: 'Porky',
    lastName: 'Pig',
    email: 'p@gmail.com',
    password: 'p',
    passwordConfirmation: 'p',
    photo: 'https://vignette1.wikia.nocookie.net/looneytunes/images/5/55/Porky-Pig.gif/revision/latest?cb=20160908001057'
  }, {
    firstName: 'Mickey',
    lastName: 'Mouse',
    email: 'mic@gmail.com',
    password: 'm',
    passwordConfirmation: 'm',
    photo: 'https://lumiere-a.akamaihd.net/v1/images/character_mickeymouse_home_mickey_notemplate_3a0db1b2.jpeg?region=0,0,600,600&width=320'
  }, {
    firstName: 'Donald',
    lastName: 'Duck',
    email: 'don@gmail.com',
    password: 'd',
    passwordConfirmation: 'd',
    photo: 'https://s-media-cache-ak0.pinimg.com/736x/f9/44/98/f944980f424d28501fe6fb8232d844c5--donald-duck-party-donald-duck-cake.jpg'
  }, {
    firstName: 'Betty',
    lastName: 'Boop',
    email: 'boop@gmail.com',
    password: 'b',
    passwordConfirmation: 'b',
    photo: 'http://bettyboop.com/wp-content/themes/bb/img/betty_new.png'
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
