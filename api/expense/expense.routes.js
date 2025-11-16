const express = require("express");
const { ExpenseController } = require("./expense.controller");
const router = express.Router();

const expenseController = new ExpenseController();

router.post("/add", expenseController.addExpense);
router.get("/get/:userId", expenseController.getDashborad);


module.exports = router;