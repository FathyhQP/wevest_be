const { Router } = require("express");
const { verifyToken } = require("../middleware/auth");
const { getMe } = require("../controllers/me_controllers/get_me.controller");
const {
  updateMe,
} = require("../controllers/me_controllers/update_me.controller");
const {
  deleteMe,
} = require("../controllers/me_controllers/delete_me.controller");
const { getTransactionHistory } = require("../controllers/me_controllers/transaction_history.controller");

const meRouter = Router();

meRouter.get("/me", verifyToken, getMe);
meRouter.patch("/me", verifyToken, updateMe);
meRouter.delete("/me", verifyToken, deleteMe);
meRouter.get("/me/transaction-history", verifyToken, getTransactionHistory);

module.exports = meRouter;
