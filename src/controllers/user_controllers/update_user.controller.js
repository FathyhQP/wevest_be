const { prisma } = require("../../config/prisma");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { uploadFile } = require("../../utils/upload-file");

const updateUser = async (req, res) => {
  const { user_code } = req.params;
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

  if (!user_code) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "User code is required",
      data: null,
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        user_code,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
        data: null,
      });
    }

    const dataToUpdate = {};

    if (fullname) dataToUpdate.fullname = fullname;
    if (username) dataToUpdate.username = username;
    if (email) dataToUpdate.email = email;
    if (phone) dataToUpdate.phone = phone;
    if (job_status) dataToUpdate.job_status = job_status;
    if (field !== undefined) dataToUpdate.field = field;
    if (role) dataToUpdate.role = role;

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const avatar = req.files?.avatar;

    if (avatar && !Array.isArray(avatar)) {
      if (existingUser.avatar && fs.existsSync(existingUser.avatar)) {
        fs.unlinkSync(existingUser.avatar);
      }

      const allowedExtensions = [".png", ".jpg", ".jpeg"];
      const destinationPath = `./public/uploads/avatars`;

      const uploadedAvatar = await uploadFile(
        avatar,
        destinationPath,
        allowedExtensions
      );

      dataToUpdate.avatar = uploadedAvatar;
    }

    const updatedUser = await prisma.user.update({
      where: {
        user_code,
      },
      data: dataToUpdate,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "User updated successfully",
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

module.exports = { updateUser };
