// AuthRoutes.js
const express = require("express");
const { BudgetController} = require("./budget.controller");
const router = express.Router();

const budgetController = new BudgetController();

router.post("/set", budgetController.setBudget);
router.get("/get/:userId", budgetController.getBudgets);
router.delete("/delete/:budgetId", budgetController.deleteBudget);
router.put("/update/:budgetId", budgetController.updateBudget);


module.exports = router;