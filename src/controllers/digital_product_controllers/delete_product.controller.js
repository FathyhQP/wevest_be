const { prisma } = require("../../config/prisma");
const fs = require("fs");


const deleteProduct = async (req, res) => {
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
    
    if (product.thumbnail && fs.existsSync(product.thumbnail)) {
      fs.unlinkSync(product.thumbnail);
    }

    if (product.file_path && fs.existsSync(product.file_path)) {
      fs.unlinkSync(product.file_path);
    }

    await prisma.digitalProduct.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Product deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
      data: null,
    });
  }
};

module.exports = deleteProduct;