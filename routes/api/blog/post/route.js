const express = require('express');
const authenticate = require("../../../../middleware/authenticate");
const postApiRoutes = express.Router();

const {getPostsCtrl, createPostCtrl, getPostCtrl, deletePostCtrl} = require("../../../../controllers/blog/post/controller");

postApiRoutes.get("/", getPostsCtrl);
postApiRoutes.post("/create", authenticate, createPostCtrl);
postApiRoutes.delete("delete/:id", authenticate, deletePostCtrl);
postApiRoutes.get("/:id", getPostCtrl);

module.exports = postApiRoutes;