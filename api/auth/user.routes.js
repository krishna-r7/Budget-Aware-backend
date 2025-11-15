// AuthRoutes.js
const express = require("express");

const { AuthController} = require("./user.controller");


const router = express.Router();

const authController = new AuthController();



router.post("/signup", authController.signup);


// getDetailsImages
module.exports = router;