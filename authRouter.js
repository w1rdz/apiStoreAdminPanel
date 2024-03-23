const Router = require("express");
const router = new Router();
const controller = require("./authController")
const authMiddlewaree = require("./middlewaree/autjhMiddlewaree")
const roleMiddlewaree = require("./middlewaree/roleMiddlewaree");
const { Statistics } = require("./models/db");

router.post("/login",controller.login);
router.get("/users", roleMiddlewaree( ['admin']),controller.getUsers);
router.post("/users",roleMiddlewaree( ['admin']),controller.addUser);
router.delete("/users/:id",roleMiddlewaree( ['admin']),controller.delUser)
router.put("/users/:id/reset-password",roleMiddlewaree( ['admin']),controller.resPass);

router.get("/products",authMiddlewaree,controller.getProduct);
router.post("/products",roleMiddlewaree( ['admin']),controller.addProduct);
router.get("/products/:id",authMiddlewaree,controller.getOneProduct)
router.put("/products/:id",roleMiddlewaree( ['admin']),controller.resProduct)
router.delete("/products/:id",roleMiddlewaree( ['admin']),controller.delProduct);

router.get("/orders",authMiddlewaree,controller.getOrder);
router.put("/orders/:id",authMiddlewaree,controller.updateOrder);

router.get("/statistics",roleMiddlewaree( ['admin']),controller.getStat);

module.exports = router;