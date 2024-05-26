const authenticate = (req, res, next) => {
  if (req.session.adminAuth === true) {
    next();
  } else {
    res.redirect('/notAuthorized');
  }
};

module.exports = authenticate;
