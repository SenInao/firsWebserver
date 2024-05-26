const express = require('express');
const authenticate = require("../../../../middleware/authenticate");
const userApiRoutes = express.Router();

const {registerCtrl, loginCtrl, logoutCtrl, profileCtrl, profileDetailsCtrl, updateProfileCtrl} = require("../../../../controllers/blog/user/controller");

// Register
userApiRoutes.post("/register", registerCtrl);

// Login
userApiRoutes.post("/login", loginCtrl)

// Logout
userApiRoutes.get("/logout", authenticate, logoutCtrl);

// Profile
userApiRoutes.get("/profile", authenticate, profileDetailsCtrl);

// Profile details
userApiRoutes.get("/profile/:id", profileCtrl);

// Update Profile
userApiRoutes.put("/profile", authenticate, updateProfileCtrl);

module.exports = userApiRoutes;