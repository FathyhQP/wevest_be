const { prisma } = require("../../config/prisma");

const { Role } = require("@prisma/client");

const getUsers = async (req, res) => {
  const { role } = req.query;

  try {
    if (role && !(role === "CUSTOMER" || role === "ADMIN")) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid user role.",
      });
    }

    const userRole = role || Role.CUSTOMER;
    const users = await prisma.user.findMany({
      where: {
        role: userRole,
      },
    });

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
