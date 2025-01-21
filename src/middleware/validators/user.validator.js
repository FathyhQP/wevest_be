const { isLength, isStrongPassword } = require("validator");

const isEmail = require("validator/lib/isEmail");

const { prisma } = require("../../config/prisma");

const validateUserInput = async (req, res, next) => {
  const userData = req.body;
  const userCode = req.params?.user_code;

  const isPatchMethod = req.method === "PATCH";

  if (!isPatchMethod) {
    const requiredFields = [
      "fullname",
      "username",
      "email",
      "phone",
      "job_status",
      "password",
      "confirm_password",
    ];

    const missingFields = requiredFields.filter((field) => !userData[field]);

    if (missingFields.length > 0) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
  }

  if (userData.username) {
    if (
      !isLength(userData.username, {
        min: 6,
        max: 20,
      })
    ) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: "Username must be between 6 and 20 characters",
      });
    }

    // Allow letters, numbers, hyphens (-), underscores (_), and dots (.)
    const usernameRegex = /^[a-zA-Z0-9-_.]+$/;
    if (!usernameRegex.test(userData.username)) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message:
          "Username can only contain letters, numbers, hyphens (-), underscores (_), and dots (.)",
      });
    }
  }

  if (userData.email) {
    const trimEmail = userData.email.trim();
    if (!isEmail(trimEmail)) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: "Email must be a valid email",
      });
    }
  }

  if (userData.phone) {
    const trimPhone = userData.phone.trim();
    const phoneRegex = /^[0-9]+$/;

    if (!phoneRegex.test(trimPhone)) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: "Phone number must be contain only numbers",
      });
    }

    if (!isLength(trimPhone, { min: 10, max: 13 })) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: "Phone number must be between 10 and 13 characters",
      });
    }
  }

  if (
    userData.jobs_status &&
    userData.jobs_status !== "TIDAK_BEKERJA" &&
    userData.jobs_status !== "BEKERJA" &&
    userData.jobs_status !== "MAHASISWA"
  ) {
    return res.status(400).send({
      status_code: 400,
      success: false,
      message:
        "Job status must be either 'TIDAK_BEKERJA', 'BEKERJA', or 'MAHASISWA'",
    });
  }

  if (userData.password) {
    if (!userData.confirm_password) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: "Confirm password is required",
      });
    }

    const trimPassword = userData.password.trim();
    const trimConfirmPassword = userData.confirm_password.trim();

    if (
      !isStrongPassword(trimPassword, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
      })
    ) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: [
          "Password must be at least 6 characters long",
          "Password must contain at least one lowercase letter",
          "Password must contain at least one uppercase letter",
        ].join(", "),
      });
    }

    if (trimPassword !== trimConfirmPassword) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: "Passwords do not match",
      });
    }
  }

  if (
    userData.role &&
    userData.role !== "ADMIN" &&
    userData.role !== "CUSTOMER"
  ) {
    return res.status(400).send({
      status_code: 400,
      success: false,
      message: "Role must be either 'ADMIN' or 'CUSTOMER'",
    });
  }

  let user = null;
  if (userCode) {
    user = await prisma.user.findUnique({
      where: {
        user_code: userCode,
      },
    });

    if (!user) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: "User not found",
      });
    }
  }

  if (userData.username && user?.username !== userData.username) {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: userData.username,
      },
    });

    if (existingUser) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: "Username already exists",
      });
    }
  }

  if (userData.email && user?.email !== userData.email) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (existingUser) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: "Email already exists",
      });
    }
  }

  if (userData.phone && user?.phone !== userData.phone) {
    const existingUser = await prisma.user.findUnique({
      where: {
        phone: userData.phone,
      },
    });

    if (existingUser) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: "Phone number already exists",
      });
    }
  }

  next();
};

module.exports = { validateUserInput };
