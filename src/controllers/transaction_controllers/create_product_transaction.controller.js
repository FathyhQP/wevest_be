const { prisma } = require("../../config/prisma");

const createProductTransaction = async (req, res) => {
  const { product_id: product_id } = req.params;
  const { id } = req.user;

  if (!product_id) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Product code is required",
      data: null,
    });
  }

  if (!id) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "User code is required",
      data: null,
    });
  }

  try {
    const product = await prisma.digitalProduct.findUnique({
      where: {
        id: product_id,
      },
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Product not found",
        data: null,
      });
    }
    
    const transaction = await prisma.transaction.create({
      data: {
        product_id: product_id,
        user_id: id,
        amount: product.price,
        transaction_type: "DIGITAL_PRODUCT",
      },
    });

    if (!transaction) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Failed to create transaction",
        data: null,
      });
    }
   
    return res.status(201).json({
      success: true,
      status: 201,
      message: "transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
      data: null,
    });
  }
};

module.exports = { createProductTransaction };
