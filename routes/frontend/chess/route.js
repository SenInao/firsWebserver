const express = require("express")
const chessRoutes = express.Router()

chessRoutes.get("/", (req, res) => {
	res.render("chess/index", {response: null})
});

module.exports = chessRoutes;
