const { prisma } = require("../../config/prisma");

const getProductDetail = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Product ID is required",
      data: null,
    });
  }

  try {
    const product = await prisma.digitalProduct.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Product details fetched successfully",
      data: product,
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

module.exports = { getProductDetail };
