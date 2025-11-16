const Category = require("./category.model");

class CategoryController {

    addCat = async (req, res) => {
        const { userId, name, color } = req.body;

        try {
            if (!userId) {
                return res
                    .status(400)
                    .json({ status_code: 400, error: "User ID is required." });
            }
            if (!name) {
                return res
                    .status(400)
                    .json({ status_code: 400, error: "Name is required." });
            }
            if (!color) {
                return res
                    .status(400)
                    .json({ status_code: 400, error: "Color is required." });
            }

            const newCategory = new Category({
                userId,
                name,
                color,
                createdAt: Date.now()
            });
            await newCategory.save();
            res.status(200).json({
                status_code: 200,
                message: "Category registered successfully.",
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    updateCat = async (req, res) => {
        const {  name, color } = req.body;

        try {
            const { categoryId } = req.params;
            
            if (!categoryId) {
                return res
                    .status(400)
                    .json({ status_code: 400, error: "Category ID is required." });
            }

            const category = await Category.findById(categoryId);
            if (!category) {
                return res
                    .status(400)
                    .json({ status_code: 400, error: "Category not found." });
            }
            category.name = name;
            category.color = color;
            await category.save();
            res.status(200).json({
                status_code: 200,
                message: "Category updated successfully.",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };


    deleteCat = async (req, res) => {
        const { categoryId } = req.params;
        try {
        
            if (!categoryId) {
                return res
                    .status(400)
                    .json({ status_code: 400, error: "Category ID is required." });
            }
            const category = await Category.findById(categoryId);
            if (!category) {
                return res
                    .status(400)
                    .json({ status_code: 400, error: "Category not found." });
            }
            category.deleted = true;
            await category.save();
            res.status(200).json({
                status_code: 200,
                message: "Category deleted successfully.",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    getCat = async (req, res) => {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        try {
            if (!userId) {
                return res
                    .status(400)
                    .json({ status_code: 400, error: "User ID is required." });
            }
            const skip = (page - 1) * limit;
            const categories = await Category.find({ userId, deleted: false }).skip(skip)
                .limit(parseInt(limit));
            const total = await Category.countDocuments({ userId, deleted: false });
            res.status(200).json({
                status_code: 200,
                message: "Categories retrieved successfully.",
                categories,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit),
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    getAllCat = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res
                    .status(400)
                    .json({ status_code: 400, error: "User ID is required." });
            }
            const categories = await Category.find({ userId, deleted: false }).select("name color");
            res.status(200).json({
                status_code: 200,
                message: "Categories retrieved successfully.",
                data:categories,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    getCatById = async (req, res) => {
        const { categoryId } = req.params;
        try {
            if (!categoryId) {
                return res
                    .status(400)
                    .json({ status_code: 400, error: "Category ID is required." });
            }
            const category = await Category.findById(categoryId);
            if (!category) {
                return res
                    .status(400)
                    .json({ status_code: 400, error: "Category not found." });
            }
            res.status(200).json({
                status_code: 200,
                message: "Category retrieved successfully.",
                category,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }



};


module.exports = {
    CategoryController,
};     