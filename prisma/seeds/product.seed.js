const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

const seedProducts = async () => {
  const productData = [
    {
      title: "Financial Planning Guide",
      description:
        "A comprehensive PDF guide to help you plan your financial future. This document covers investment strategies, retirement planning, and wealth management techniques tailored for beginners to advanced investors.",
      price: 20000,
      file_path: "public\\uploads\\thumbnails\\file_1742999120299.pdf",
      thumbnail: "public\\uploads\\thumbnails\\file_1742999120301.jpg",
      category: "pdf",
      tag: "",
    },
    {
      title: "Investment Proposal Template",
      description:
        "Professional Word template for creating compelling investment proposals. Includes pre-formatted sections, charts, and financial analysis frameworks that can be customized for your specific investment needs.",
      price: 10000,
      file_path: "public\\uploads\\thumbnails\\file_1742999143981.docx",
      thumbnail: "public\\uploads\\thumbnails\\file_1742999143983.jpg",
      category: "docx",
      tag: "",
    },
    {
      title: "Portfolio Tracker Spreadsheet",
      description:
        "Advanced Excel spreadsheet with formulas to track and analyze your investment portfolio performance. Features automated calculations for ROI, diversification metrics, and risk analysis.",
      price: 30000,
      file_path: "public\\uploads\\thumbnails\\file_1742999435038.xlsx",
      thumbnail: "public\\uploads\\thumbnails\\file_1742999435042.jpg",
      category: "xlsx",
      tag: "featured",
    },
  ];

  for (const product of productData) {
    try {
      const createdProduct = await prisma.digitalProduct.create({
        data: {
          title: product.title,
          description: product.description,
          price: product.price,
          file_path: product.file_path,
          thumbnail: product.thumbnail,
          category: product.category,
          tag: product.tag,
        },
      });

      console.log(`Product created: ${createdProduct.title}`);
    } catch (error) {
      console.error(
        `Error creating product "${product.title}":`,
        error.message
      );
    }
  }

  console.log("Product seeding completed!");
};

module.exports = { seedProducts };
