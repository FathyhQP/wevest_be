const { Router } = require("express");
const { verifyToken } = require("../middleware/auth");
const { createProductTransaction } = require("../controllers/transaction_controllers/create_product_transaction.controller.");

const transactionRouter = Router();

transactionRouter.post("/transaction/:product_id", verifyToken, createProductTransaction);


module.exports = transactionRouter;
