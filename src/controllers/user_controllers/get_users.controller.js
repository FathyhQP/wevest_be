const { prisma } = require("../../config/prisma");

const { Role } = require("@prisma/client");

const getUsers = async (req, res) => {
  const { role, search, page, limit, job_status } = req.query;

  if (role && !(role === "CUSTOMER" || role === "ADMIN")) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Invalid user role.",
    });
  }

  // pagination defaults and calculation
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  const filters = {
    role: role || Role.CUSTOMER,
  };

  if (job_status) {
    filters.job_status = job_status;
  }

  if (search) {
    filters.OR = [
      { fullname: { contains: search, } },
      { username: { contains: search, } },
      { email: { contains: search,} },
    ];
  }

  try {
    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: filters,
        skip,
        take: pageSize,
      }),
      prisma.user.count({
        where: filters,
      }),
    ]);

    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "User not found.",
        data: users,
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "User fetched successfully",
      data: users,
      pagination: {
        total: totalUsers,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalUsers / pageSize),
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

module.exports = { getUsers };
