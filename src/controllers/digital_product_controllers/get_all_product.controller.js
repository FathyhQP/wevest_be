const { prisma } = require("../../config/prisma");

const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = "",
      category,
      sort = "newest",
      tag,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid pagination parameters",
        data: null,
      });
    }

    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (tag) {
      where.tag = tag;
    }

    let orderBy = {};
    if (sort === "newest") {
      orderBy = { created_at: "desc" };
    } else if (sort === "oldest") {
      orderBy = { created_at: "asc" };
    } else if (sort === "price_low_high") {
      orderBy = { price: "asc" };
    } else if (sort === "price_high_low") {
      orderBy = { price: "desc" };
    } else if (sort === "title_asc") {
      orderBy = { title: "asc" };
    } else if (sort === "title_desc") {
      orderBy = { title: "desc" };
    }

    const totalCount = await prisma.digitalProduct.count({ where });

    const skip = (pageNumber - 1) * limitNumber;
    const totalPages = Math.ceil(totalCount / limitNumber);

    const products = await prisma.digitalProduct.findMany({
      where,
      orderBy,
      skip,
      take: limitNumber,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Digital products fetched successfully",
      data: {
        products,
        pagination: {
          total: totalCount,
          page: pageNumber,
          limit: limitNumber,
          totalPages,
        },
        sort: sort,
        search: search,
        category: category,
        tag: tag,
      },
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

module.exports = { getAllProducts };
