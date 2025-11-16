const Budget = require("./budget.model");



class BudgetController {

    setBudget = async (req, res) => {
        try {
            const { category, limit, month, userId } = req.body;

            const monthToUse = month ? month.slice(0, 7) : dayjs().format("YYYY-MM");
            // console.log(monthToUse);
            const existing = await Budget.findOne({
                userId,
                categoryId: category,
                month: monthToUse,
            });

            if (existing) {
                return res.status(400).json({
                    status_code: 400,
                    error: "Budget already exists for this category and month.",
                });
            }
            const budget = new Budget(
                { userId, categoryId: category, month: monthToUse, limit });
            await budget.save();
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
            const { userId } = req.params;
            const { page = 1, limit = 10, date } = req.query;
            const skip = (page - 1) * limit;

            if (!userId) {
                return res.status(400).json({ error: "User ID is required." });
            }

            let month;

            if (date) {
                const d = new Date(date);
                const year = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                month = `${year}-${mm}`;
            } else {
                const now = new Date();
                const year = now.getFullYear();
                const mm = String(now.getMonth() + 1).padStart(2, "0");
                month = `${year}-${mm}`;
            }


            const budgets = await Budget.find({ userId, month }).populate("categoryId").skip(skip)
                .limit(Number(limit));

            const total = await Budget.countDocuments({ userId, month });

            res.status(200).json({
                status_code: 200,
                message: "Budgets retrieved successfully.",
                data: budgets,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
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

    updateBudget = async (req, res) => {
        try {
            const { budgetId } = req.params;
            const { limit } = req.body;
            const budget = await Budget.findById(budgetId);
            if (!budget) {
                return res.status(404).json({ error: "Budget not found." });
            }
            budget.limit = limit;
            await budget.save();
            res.status(200).json({
                status_code: 200,
                message: "Budget updated successfully.",
                data: budget,
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
