const { Router } = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { getAllProducts } = require("../controllers/digital_product_controllers/get_all_product.controller");
const { updateProduct } = require("../controllers/digital_product_controllers/update_product.controller");
const { createProduct } = require("../controllers/digital_product_controllers/create_product.controller");


const meRouter = Router();

meRouter.get("/digital-product", getAllProducts);
meRouter.patch("/digital-product/:id", verifyToken, authorizeRole("ADMIN"), updateProduct);
meRouter.post("/digital-product", verifyToken, authorizeRole("ADMIN"), createProduct);


module.exports = meRouter;
