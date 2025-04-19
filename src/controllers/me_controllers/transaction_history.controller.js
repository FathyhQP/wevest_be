const { prisma } = require("../../config/prisma");

const getTransactionHistory = async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const { page = 1, limit = 5, sort = "newest" } = req.query;
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

    const where = {
      user_id: user_id,
    };

    let orderBy = {};
    if (sort === "newest") {
      orderBy = { created_at: "desc" };
    } else if (sort === "oldest") {
      orderBy = { created_at: "asc" };
    }

    const totalCount = await prisma.transaction.count({ where });

    const skip = (pageNumber - 1) * limitNumber;
    const totalPages = Math.ceil(totalCount / limitNumber);

    const transactionHistory = await prisma.transaction.findMany({
      where,
      orderBy,
      skip,
      take: limitNumber,
      include: {
        digital_product: {
          select: {
            id: true,
            title: true,
            price: true,
            thumbnail: true,
            category: true,
            tag: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Transaction history fetched successfully",
      data: {
        transactionHistory,
        pagination: {
          total: totalCount,
          page: pageNumber,
          limit: limitNumber,
          totalPages,
        },
        sort: sort,
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

module.exports = { getTransactionHistory };
