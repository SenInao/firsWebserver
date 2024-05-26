const express = require("express")
const aiRoutes = express.Router()

aiRoutes.get("/", (req, res) => {
	res.render("ai/index", {response: null})
});

module.exports = aiRoutes
