const express = require('express');
const aiApiRoutes = express.Router();

const generateAnswer = require("../../../controllers/ai/controller")

aiApiRoutes.post("/answer", generateAnswer);

module.exports = aiApiRoutes;
