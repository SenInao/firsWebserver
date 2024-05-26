const express = require("express");
const adminRoutes = express.Router();
const authenticate = require("../../../middleware/authenticateAdmin")
const execRequest = require("../../../utils/execReq")
const readFile = require("../../../utils/readFile")

adminRoutes.get("/", authenticate,(req, res) => {
  res.render("admin/index");
});

adminRoutes.get("/login", (req, res) => {
  res.render("admin/login");
});

adminRoutes.get("/backdoor", authenticate, async (req, res) => {
	try {
		try {
			var connectionlist = await execRequest("py utils/web.py");
			connectionlist = connectionlist.replace("[[", "").replace("]]", "").split("], [");
		} catch (error) {
			var connectionlist = "";
		};

		res.render("admin/backdoor/index", {connectionlist:connectionlist});

	} catch (error) {
		res.redirect("/")
	}

})

adminRoutes.get("/logs", authenticate, async (req, res) => {
	try {
		var log = await readFile("access.log");
		log = log.replaceAll("ffff", "").split("::::");
		
		res.render("admin/logs/index", {log:log});

	} catch (error) {
		console.log(error);
		res.redirect("/");
	}
})

module.exports = adminRoutes;
