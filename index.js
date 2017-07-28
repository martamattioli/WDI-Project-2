// "heroku run node db/seeds" for heroku
const express        = require('express');
const morgan         = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose       = require('mongoose');
const bluebird       = require('bluebird');
const session = require('express-session');
const flash = require('express-flash');
const { port, db, secret }   = require('./config/env');
const routes         = require('./config/routes');
const User = require('./models/user');
const cors           = require('cors'); //ADDED
const app            = express();

mongoose.Promise     = bluebird;
mongoose.connect(db);

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use(cors()); //ADDED
app.use(morgan('dev'));
app.use(expressLayouts);
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function (req) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(session({
  secret: secret,
  resave: false,
  seveUninitialized: false
}));

app.use((req, res, next) => {
  if (!req.session.userId) return next();

  User
    .findById(req.session.userId)
    .exec()
    .then(user=> {
      if (!user) {
        return req.session.regenerate(() => {
          req.flash('danger', 'You must be logged in to view this content');
          res.redirect('/');
        });
      }
      req.session.userId = user._id;

      req.currentUser = user;

      res.locals.currentUser = user;
      res.locals.isLoggedIn = true;

      next();
    });
});

app.use(flash());

app.use(routes);
app.listen(port, () => console.log(`Express up and running on port: ${port}`));
