const Budget = require("./budget.model");



class BudgetController {

    setBudget = async (req, res) => {
        try {
            const { categoryId, limit, month } = req.body;
            const budget = await Budget.findOneAndUpdate(
                { userId: req.user, categoryId, month },
                { limit },
                { upsert: true, new: true }
            );
            res.status(201).json({
                status_code: 200,
                message: "Budget added successfully.",
                data: budget,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    getBudgets = async (req, res) => {
        try {
            const { userId, month } = req.params;
            const budgets = await Budget.find({ userId, month }).populate("categoryId");
            res.status(200).json({
                status_code: 200,
                message: "Budgets retrieved successfully.",
                data: budgets,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };



    deleteBudget = async (req, res) => {
        try {
            const { budgetId } = req.params;
            const budget = await Budget.findById(budgetId);
            if (!budget) {
                return res.status(404).json({ error: "Budget not found." });
            }
            await budget.deleteOne();
            res.status(200).json({
                status_code: 200,
                message: "Budget deleted successfully.",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

  


};


module.exports = {
    BudgetController,
};    
