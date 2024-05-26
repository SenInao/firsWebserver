const express = require('express');
const authenticate = require("../../../../middleware/authenticate");
const createCommentCtrl = require("../../../../controllers/blog/comment/controller");
const commentApiRoutes = express.Router();

commentApiRoutes.post("/create/:id", authenticate, createCommentCtrl);
commentApiRoutes.delete("/delete/:id", authenticate);

module.exports = commentApiRoutes;