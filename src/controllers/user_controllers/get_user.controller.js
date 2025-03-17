const { prisma } = require("../../config/prisma");

const getUserDetail = async (req, res) => {
  const { user_code } = req.params;

  if (!user_code) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "User code is required",
      data: null,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        user_code,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
        data: null,
      });
    }

    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "User retrieved successfully",
      data: userWithoutPassword,
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

module.exports = { getUserDetail };
