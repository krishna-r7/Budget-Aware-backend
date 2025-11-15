const express = require("express");
const userRoutes = require("./auth/user.routes");
const categoryRoutes = require("./category/category.routes");


const router = express.Router();

router.use("/auth/user", userRoutes);
router.use("/category", categoryRoutes);



module.exports = router;