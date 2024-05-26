const express = require("express");
const homeRoutes = express.Router();

homeRoutes.get("/", (req, res) => {
  res.render("index");
});

homeRoutes.get("/about", (req, res) => {
  res.render("about");
});

homeRoutes.get("/other", (req, res) => {
  res.render("other");
});

homeRoutes.get("/notAuthorized", (req, res) => {
  res.render("notAuthorized");
});

homeRoutes.get("*", (req, res) => {
  res.render("notFound");
});

module.exports = homeRoutes;
