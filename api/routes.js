const express = require("express");
const userRoutes = require("./auth/user.routes");
const categoryRoutes = require("./category/category.routes");
const expRoutes = require("./expense/expense.routes");
const budgetRoutes = require("./budget/budget.routes");

// const authRoutes = require("./auth/auth.routes");

const router = express.Router();

router.use("/auth/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/expense", expRoutes);
router.use("/budget", budgetRoutes);





module.exports = router;