const express = require('express');
const appHandler = require("../../../utils/appHandler");
const authenticate = require("../../../middleware/authenticate")
const blogRoutes = express.Router();
const Post = require("../../../models/blog/post");
const User = require("../../../models/blog/user");

blogRoutes.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user");

    res.render("blog/index", {auth: req.session.userAuth, posts});
  } catch (error) {
    res.json(next(appHandler(error.message, 500)));
  }
});

blogRoutes.get("/user/profile", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userAuth).populate("posts");
    res.render("blog/user/profile", {auth: req.session.userAuth, user});

  } catch (error) {
    res.json(next(appHandler(error.message, 500)));
  }
});

blogRoutes.get("/user/login", (req, res) => {
  res.render("blog/user/login", {auth: req.session.userAuth, error: null})
});

blogRoutes.get("/user/register", (req, res) => {
  res.render("blog/user/register", {auth: req.session.userAuth, error: null})
});

blogRoutes.get("/post/create", authenticate, (req, res) => {
  res.render("blog/post/create", {auth: req.session.userAuth, error: null})
});

blogRoutes.get("/post/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("user").populate({path:"comments", populate: {path: "user"}});
    res.render("blog/post/post", {auth: req.session.userAuth, post});
  } catch (error) {
    res.json(next(appHandler(error.message, 500)));
  }
});

module.exports = blogRoutes;