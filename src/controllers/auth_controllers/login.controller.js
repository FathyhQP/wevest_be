const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../../config/prisma");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "You can't login with a nonexistent account.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        user_code: existingUser.user_code,
        role: existingUser.role,
      },

      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { login };
