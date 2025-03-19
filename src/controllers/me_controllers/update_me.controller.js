const { prisma } = require("../../config/prisma");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { uploadFile } = require("../../utils/upload-file");

const updateMe = async (req, res) => {
  try {
    const { user_code } = req.user;
    const {
      fullname,
      username,
      email,
      phone,
      job_status,
      field,
      current_password,
      new_password,
      confirm_password,
    } = req.body;

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

    const updatedProfile = {};

    if (fullname) updatedProfile.fullname = fullname;
    if (field !== undefined) updatedProfile.field = field;

    if (username && username !== user.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Username already exists",
          data: null,
        });
      }

      updatedProfile.username = username;
    }

    if (email && email !== user.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Email already exists",
          data: null,
        });
      }

      updatedProfile.email = email;
    }

    if (phone && phone !== user.phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Phone number already exists",
          data: null,
        });
      }

      updatedProfile.phone = phone;
    }

    if (job_status) {
      if (
        job_status !== "Tidak Bekerja" &&
        job_status !== "Bekerja" &&
        job_status !== "Mahasiswa"
      ) {
        return res.status(400).json({
          success: false,
          status: 400,
          message:
            "Job status must be either 'Tidak Bekerja', 'Bekerja', or 'Mahasiswa'",
          data: null,
        });
      }

      updatedProfile.job_status = job_status;
    }

    if (new_password) {
      if (!current_password) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Current password is required to change password",
          data: null,
        });
      }

      const isPasswordValid = await bcrypt.compare(
        current_password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Current password is incorrect",
          data: null,
        });
      }

      if (new_password !== confirm_password) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "New password and confirm password do not match",
          data: null,
        });
      }

      updatedProfile.password = await bcrypt.hash(new_password, 10);
    }

    const avatar = req.files?.avatar;
    if (avatar && !Array.isArray(avatar)) {
      if (user.avatar && fs.existsSync(user.avatar)) {
        fs.unlinkSync(user.avatar);
      }

      const allowedExtensions = [".png", ".jpg", ".jpeg"];
      const destinationPath = `./public/uploads/avatars`;

      updatedProfile.avatar = await uploadFile(
        avatar,
        destinationPath,
        allowedExtensions
      );
    }

    const updatedUser = await prisma.user.update({
      where: { user_code },
      data: updatedProfile,
    });

    const { password, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Profile updated successfully",
      data: userWithoutPassword,
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

module.exports = { updateMe };
