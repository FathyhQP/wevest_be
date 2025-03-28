const { prisma } = require("../../config/prisma");
const { uploadFile } = require("../../utils/upload-file");

const createProduct = async (req, res) => {
  const { title, description, price, category, tag } = req.body;

  const file = req.files?.file;
  const thumbnail = req.files?.thumbnail;

  try {
    let uploadedFile = null;
    let uploadedThumbnail = null;

    if (!file || Array.isArray(file)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Product file is required",
        data: null,
      });
    }

    const fileAllowedExtensions = [".pdf", ".zip", ".doc", ".docx", ".xlsx", ".xls", ".ppt", ".pptx"];
    const fileDestinationPath = `./public/uploads/digital_products`;

    uploadedFile = await uploadFile(
      file,
      fileDestinationPath,
      fileAllowedExtensions
    );

    if (thumbnail && !Array.isArray(thumbnail)) {
      const thumbnailAllowedExtensions = [".png", ".jpg", ".jpeg"];
      const thumbnailDestinationPath = `./public/uploads/thumbnails`;

      uploadedThumbnail = await uploadFile(
        thumbnail,
        thumbnailDestinationPath,
        thumbnailAllowedExtensions
      );
    }

    const productPrice = parseFloat(price);
    if (isNaN(productPrice) || productPrice <= 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Price must be a positive number",
        data: null,
      });
    }

    const newProduct = await prisma.digitalProduct.create({
      data: {
        title,
        description,
        price: productPrice,
        file_path: uploadedFile,
        thumbnail: uploadedThumbnail,
        category,
        tag
      },
    });

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Digital product created successfully",
      data: newProduct,
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

module.exports = { createProduct };
