const User = require('../models/user');

function registrationsNew(req, res) {
  res.render('registrations/new');
}

function registrationsCreate(req, res) {
  User
    .create(req.body)
    .then((user) => {
      req.flash('success', `Thanks for registering ${user.firstName}!`);
      req.session.userId = user._id;
      res.redirect('/');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).render('registrations/new', { message: 'Passwords do not match' });
      }
      res.status(500).end();
    });
}

module.exports = {
  new: registrationsNew,
  create: registrationsCreate
};
