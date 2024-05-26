const express = require("express")
const golRoutes = express.Router()

golRoutes.get("/", (req, res) => {
	res.render("gameOfLife/index")
});

module.exports = golRoutes
