const { prisma } = require("../../config/prisma");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { fullname, username, email, phone, job_status, field, password } =
    req.body;

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
      },
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: "User created successfully",
      data: newUser,
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

module.exports = { register };
