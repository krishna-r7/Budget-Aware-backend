const express = require("express");
const userRoutes = require("./auth/user.routes");


const router = express.Router();

router.use("/auth/customer", userRoutes);



module.exports = router;