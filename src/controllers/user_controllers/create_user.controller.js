const { prisma } = require("../../config/prisma");
const bcrypt = require("bcryptjs");
const createUser = async (req, res) => {
  const {
    fullname,
    username,
    email,
    phone,
    job_status,
    field,
    password,
    role,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        user_code: `USR_${new Date().getTime()}`,
        fullname,
        username,
        email,
        phone,
        job_status,
        field,
        password: hashedPassword,
        role,
      },
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "User fetched successfully",
      data: newUser,
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

module.exports = { createUser };
