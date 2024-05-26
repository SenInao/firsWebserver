const authenticate = (req, res, next) => {
  if (req.session.userAuth) {
    next();
  } else {
    res.redirect('/notAuthorized');
  }
};

module.exports = authenticate;
