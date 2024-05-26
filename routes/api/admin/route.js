const express = require('express');
const adminApiRoutes = express.Router();
const authenticate = require("../../../middleware/authenticateAdmin")

const {loginCtrl, logoutCtrl} = require("../../../controllers/admin/controller");

adminApiRoutes.post("/login", loginCtrl);
adminApiRoutes.get("/logout", authenticate, logoutCtrl)

module.exports = adminApiRoutes;
