const express = require("express")
const snakeRoutes = express.Router()

snakeRoutes.get("/", (req, res) => {
	res.render("snake/index", {response: null})
});

module.exports = snakeRoutes;
