const { prisma } = require("../../config/prisma");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const deleteMe = async (req, res) => {
  try {
    const { user_code } = req.user;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Password is required to delete your account",
        data: null,
      });
    }

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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Password is incorrect",
        data: null,
      });
    }

    await prisma.user.delete({
      where: { user_code },
    });

    if (user.avatar && fs.existsSync(user.avatar)) {
      fs.unlinkSync(user.avatar);
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Your account has been successfully deleted",
      data: null,
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

module.exports = { deleteMe };
