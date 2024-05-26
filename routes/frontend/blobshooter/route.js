const express = require("express")
const blobshooterRoutes = express.Router()

blobshooterRoutes.get("/", (req, res) => {
	res.render("blobshooter/index", {response: null})
});

module.exports = blobshooterRoutes;
