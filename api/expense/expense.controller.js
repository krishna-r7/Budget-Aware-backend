const Expense = require("./expense.model");
const Budget = require("../budget/budget.model");
const dayjs = require("dayjs");
const mongoose = require("mongoose");

class ExpenseController {

    addExpense = async (req, res) => {
        try {

            const { categoryId, amount, date, userId } = req.body;


            const expense = await Expense.create({
                userId,
                categoryId,
                amount,
                date
            });

            const monthStart = dayjs(date).startOf("month").toDate();
            const monthEnd = dayjs(date).endOf("month").toDate();

            const spent = await Expense.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        categoryId: new mongoose.Types.ObjectId(categoryId),
                        date: { $gte: monthStart, $lte: monthEnd }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            // console.log(spent);

            const totalSpent = spent[0]?.total || 0;

            const budgetMonth = dayjs(date).format("YYYY-MM");

            const budget = await Budget.findOne({
                userId,
                categoryId,
                month: budgetMonth
            });

            let status = "Within budget";

            if (budget && totalSpent > budget.limit) status = "Over budget";

            return res.status(200).json({ status_code: 200, message: "Expense added successfully.", expense, status, totalSpent });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    getDashborad = async (req, res) => {
        try {
            const { userId } = req.params;
            const {date} = req.query;

            const userObjectId = new mongoose.Types.ObjectId(userId);

            const budgets = await Budget.find({
                userId: userObjectId,
                month: dayjs(date).format("YYYY-MM")
            }).populate("categoryId");

            const monthStart = dayjs(date).startOf("month").toDate();
            const monthEnd = dayjs(date).endOf("month").toDate();

            const result = [];

            for (const budget of budgets) {
                const categoryId = budget.categoryId._id;

                const expenses = await Expense.aggregate([
                    {
                        $match: {
                            userId: userObjectId,
                            categoryId: categoryId,
                            date: { $gte: monthStart, $lte: monthEnd }
                        }
                    },
                    { $group: { _id: null, totalSpent: { $sum: "$amount" } } }
                ]);

                const spent = expenses[0]?.totalSpent || 0;
                const remaining = Math.max(budget.limit - spent, 0);

                result.push({
                    budgetId: budget._id,
                    categoryId: budget.categoryId._id,
                    name: budget.categoryId.name,
                    color: budget.categoryId.color,
                    limit: budget.limit,
                    spent,
                    remaining,
                    status: spent > budget.limit ? "Over budget" : "Within budget",
                    statusBool:spent > budget.limit ? true : false,
                });
            }

            return res.status(200).json({
                status_code: 200,
                message: "Budget with spending retrieved successfully.",
                data: result
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };


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
