const User = require('../models/user');


//I wanna create a show page for each user
function usersShow(req, res) {
  console.log(req.query);
  User // here I have access to the user that has been given back to me from the database
    .findById(req.params.id)
    .exec()
    .then(user => {
      res.render('users/show', { user });
    });
}

function usersEdit(req, res, next) {
  User
    .findById(req.params.id)
    .then((user) => {
      if(!user) return res.status(404).render('statics/404');
      res.render('users/edit', { user });
    })
    .catch(next);
}

function usersUpdate(req, res, next) {
  User
    .findById(req.params.id)
    .then((user) => {
      if(!user) return res.status(404).render('statics/404');

      for(const field in req.body) {
        user[field] = req.body[field];
      }

      return user.save();
    })
    .then((user) => res.redirect(`/users/${user.id}`))
    .catch(next);
}

module.exports = {
  show: usersShow,
  edit: usersEdit,
  update: usersUpdate
};
