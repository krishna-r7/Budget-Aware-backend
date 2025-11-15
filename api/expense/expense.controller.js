const Expense = require("./expense.model");
const Budget = require("../budget/budget.model");

class ExpenseController {


    addExpense = async (req, res) => {
        try {

            const { categoryId, amount, date } = req.body;
            const userId = req.user;

            const expense = await Expense.create({
                userId,
                categoryId,
                amount,
                date
            });

            // Check budget
            const month = date.slice(0, 7);
            const spent = await Expense.aggregate([
                {
                    $match: {
                        userId,
                        categoryId,
                        date: { $gte: new Date(`${month}-01`), $lte: new Date(`${month}-31`) }
                    }
                },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);

            const totalSpent = spent[0]?.total || 0;

            const budget = await Budget.findOne({
                userId,
                categoryId,
                month
            });

            let status = "Within budget";

            if (budget && totalSpent > budget.limit) status = "Over budget";

            return res.status(200).json({ status_code: 200, expense, status, totalSpent });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    getExpenses = async (req, res) => {
        try {
            const { userId, month } = req.params;
            const expenses = await Expense.find({
                userId, date: { $gte: new Date(`${month}-01`), $lte: new Date(`${month}-31`) }
            }).populate("categoryId");
            res.status(200).json({
                status_code: 200,
                message: "Expenses retrieved successfully.",
                expenses,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    monthlyReport = async (req, res) => {
        try {
            const { userId, month } = req.params;
            const expenses = await Expense.aggregate([
                {
                    $match: {
                        userId: req.user,
                        date: {
                            $gte: new Date(`${month}-01`),
                            $lte: new Date(`${month}-31`)
                        }
                    }
                },
                {
                    $group: {
                        _id: "$categoryId",
                        spent: { $sum: "$amount" }
                    }
                }
            ]);
            const budgets = await Budget.find({ userId, month });
            res.status(200).json({
                status_code: 200,
                message: "Monthly report retrieved successfully.",
                expenses,
                budgets,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

};


module.exports = {
    ExpenseController,
};    
