const { prisma } = require("../../config/prisma");
const { uploadFile } = require("../../utils/upload-file");
const fs = require("fs").promises;
const path = require("path");

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category } = req.body;
  const file = req.files?.file;
  const thumbnail = req.files?.thumbnail;

  try {
    const existingProduct = await prisma.digitalProduct.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Product not found",
        data: null,
      });
    }

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;

    if (price) {
      const productPrice = parseFloat(price);
      if (isNaN(productPrice) || productPrice <= 0) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Price must be a positive number",
          data: null,
        });
      }
      updateData.price = productPrice;
    }

    if (file && !Array.isArray(file)) {
      const fileAllowedExtensions = [".pdf", ".zip", ".doc", ".docx"];
      const fileDestinationPath = `./public/uploads/digital_products`;

      if (existingProduct.file_path) {
        try {
          await fs.unlink(path.join(process.cwd(), existingProduct.file_path));
        } catch (error) {
          console.log(`Failed to delete old file: ${error.message}`);
        }
      }

      const uploadedFile = await uploadFile(
        file,
        fileDestinationPath,
        fileAllowedExtensions
      );

      updateData.file_path = uploadedFile;
    }

    if (thumbnail && !Array.isArray(thumbnail)) {
      const thumbnailAllowedExtensions = [".png", ".jpg", ".jpeg"];
      const thumbnailDestinationPath = `./public/uploads/thumbnails`;

      if (existingProduct.thumbnail) {
        try {
          await fs.unlink(path.join(process.cwd(), existingProduct.thumbnail));
        } catch (error) {
          console.log(`Failed to delete old thumbnail: ${error.message}`);
        }
      }

      const uploadedThumbnail = await uploadFile(
        thumbnail,
        thumbnailDestinationPath,
        thumbnailAllowedExtensions
      );

      updateData.thumbnail = uploadedThumbnail;
    }

    const updatedProduct = await prisma.digitalProduct.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Digital product updated successfully",
      data: updatedProduct,
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

module.exports = { updateProduct };
