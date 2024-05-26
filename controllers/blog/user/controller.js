const appHandler = require("../../../utils/appHandler");
const User = require("../../../models/blog/user");
const bcrypt = require("bcryptjs");

const registerCtrl = async (req, res, next) => {
  const {fullname, email, password} = req.body;

  if (!fullname || !email || !password) {
    return res.render("blog/user/register", {auth: req.session.userAuth, error: "Please provide all fields"});
  }

  try {

    const emailTaken = await User.findOne({email})

    if (emailTaken) {
      return res.render("blog/user/register", {auth: req.session.userAuth, error: "Email already taken"});
    };

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hash
    });

    res.redirect("/blog/user/login")

  } catch (error) {
    res.json(next(appHandler(error.message, 500)));
  }
};

const loginCtrl = async (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.render("blog/user/login", {auth: req.session.userAuth, error: "Please provide all fields"});
  }

  try {
    const userFound = await User.findOne({email:email});

    if (!userFound) {
      return res.render("blog/user/login", {auth: req.session.userAuth, error: "Invalid credentials"});
    }

    const correctPassword = await bcrypt.compare(password, userFound.password);

    if (!correctPassword) {
      return res.render("blog/user/login", {auth: req.session.userAuth, error: "Invalid credentials"});
    }

    req.session.userAuth = userFound.id;

    res.redirect("/blog/user/profile")

  } catch (error) {
    res.json(next(appHandler(error.message, 500)));
  }
};

const logoutCtrl = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/blog/user/login");
  });
};

const profileDetailsCtrl = async (req, res, next) => {
  try {
    const user = User.findById(req.session.userAuth)

    res.json({
      user
    });
  } catch (error) {
    res.json(next(appError(error.message)));
  }
};

const profileCtrl = async (req, res, next) => {
  const {id} = req.body;

  try {
    const user = User.findById(id)

    if (!user) {
      return res.status(400).message("User not found")
    }

    res.json({
      user
    });
  } catch (error) {
    res.json(next(appError(error.message)));
  }
};

const updateProfileCtrl = async (req, res, next) => {
  const {fullname, email, password} = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({msg:"Please provide all fields"});
    }

    const user = User.findById(req.session.userAuth)

    res.json({
      user
    });
  } catch (error) {
    res.json(next(appError(error.message)));
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  profileCtrl,
  profileDetailsCtrl,
  updateProfileCtrl,
  logoutCtrl
};