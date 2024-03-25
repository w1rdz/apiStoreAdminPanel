const Router = require("express");
const router = new Router();
const controller = require("./authController")
const authMiddlewaree = require("./middlewaree/autjhMiddlewaree")
const roleMiddlewaree = require("./middlewaree/roleMiddlewaree");
const { Statistics } = require("./models/db");

router.post("/login",controller.login);
router.get("/users",authMiddlewaree,controller.getUsers);
router.post("/users",authMiddlewaree,controller.addUser);
router.delete("/users/:id",authMiddlewaree,controller.delUser)
router.put("/users/:id/reset-password",authMiddlewaree,controller.resPass);

router.get("/products",authMiddlewaree,controller.getProduct);
router.post("/products",authMiddlewaree,controller.addProduct);
router.get("/products/:id",authMiddlewaree,controller.getOneProduct)
router.put("/products/:id",authMiddlewaree,controller.resProduct)
router.delete("/products/:id",authMiddlewaree,controller.delProduct);

router.get("/orders",authMiddlewaree,controller.getOrder);
router.put("/orders/:id",authMiddlewaree,controller.updateOrder);

router.get("/statistics",authMiddlewaree,controller.getStat);

module.exports = router;