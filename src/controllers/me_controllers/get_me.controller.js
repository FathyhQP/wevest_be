const { prisma } = require("../../config/prisma");

const getMe = async (req, res) => {
  try {
    const { user_code } = req.user;

    const user = await prisma.user.findUnique({
      where: { user_code },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "User fetched successfully",
      data: user,
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

module.exports = { getMe };
