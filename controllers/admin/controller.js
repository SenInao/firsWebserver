const dotenv = require("dotenv").config();
const appHandler = require("../../utils/appHandler");
const User = require("../../models/blog/user");
const bcrypt = require("bcryptjs");

const loginCtrl = async (req, res, next) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.render("blog/user/login", {auth: req.session.userAuth, error: "Please provide all fields"});
  }

  try {
	if (process.env.adminU !== username) {
		res.redirect("/admin");
	}
	
	if (process.env.adminP !== password) {
		res.redirect("/admin");
	}

    req.session.adminAuth = true;

    res.redirect("/admin")

  } catch (error) {
    res.json(next(appHandler(error.message, 500)));
  }
};

const logoutCtrl = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/blog/user/login");
  });
};

module.exports = {loginCtrl, logoutCtrl};
