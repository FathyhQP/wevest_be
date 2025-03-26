const { Router } = require("express");
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { getAllProducts } = require("../controllers/digital_product_controllers/get_all_product.controller");
const { updateProduct } = require("../controllers/digital_product_controllers/update_product.controller");
const { createProduct } = require("../controllers/digital_product_controllers/create_product.controller");
const deleteProduct = require("../controllers/digital_product_controllers/delete_product.controller");


const productRouter = Router();

productRouter.get("/digital-product", getAllProducts);
productRouter.patch("/digital-product/:id", verifyToken, authorizeRole("ADMIN"), updateProduct);
productRouter.post("/digital-product", verifyToken, authorizeRole("ADMIN"), createProduct);
productRouter.delete("/digital-product/:id", verifyToken, authorizeRole("ADMIN"), deleteProduct);


module.exports = productRouter;
