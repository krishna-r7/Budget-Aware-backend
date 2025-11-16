
const express = require("express");
const { CategoryController} = require("./category.controller");
const router = express.Router();

const categoryController = new CategoryController();

router.post("/add", categoryController.addCat);
router.get("/get/:userId", categoryController.getCat);
router.get("/getById/:categoryId", categoryController.getCatById);
router.put("/update/:categoryId", categoryController.updateCat);
router.delete("/delete/:categoryId", categoryController.deleteCat);
router.get("/getAll/:userId", categoryController.getAllCat);

module.exports = router;