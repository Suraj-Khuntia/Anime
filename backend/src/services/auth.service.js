const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const { JWT_SECRET } = require('../middleware/auth.middleware');

async function loginAdmin({ usernameOrEmail, password }) {
  if (!usernameOrEmail || !password) {
    throw new Error('Username/Email and password are required');
  }

  const query = usernameOrEmail.trim();

  // Find user by username or email
  const admin = await prisma.adminUser.findFirst({
    where: {
      OR: [
        { username: query },
        { email: query },
      ],
    },
  });

  if (!admin) {
    const error = new Error('Invalid username or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    const error = new Error('Invalid username or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate JWT Token (valid for 7 days)
  const token = jwt.sign(
    { id: admin.id, username: admin.username, email: admin.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
    },
  };
}

async function getAdminProfile(id) {
  const admin = await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
  if (!admin) {
    const error = new Error('Admin user not found');
    error.statusCode = 404;
    throw error;
  }
  return admin;
}

async function changePassword(id, { oldPassword, newPassword }) {
  if (!oldPassword || !newPassword) {
    throw new Error('Both old and new password are required');
  }
  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long');
  }

  const admin = await prisma.adminUser.findUnique({ where: { id } });
  if (!admin) {
    const error = new Error('Admin not found');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(oldPassword, admin.password);
  if (!isMatch) {
    const error = new Error('Incorrect current password');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.adminUser.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return { success: true, message: 'Password updated successfully' };
}

// --- Regular User Authentication ---

async function registerUser({ name, email, password }) {
  if (!name || !name.trim()) {
    const error = new Error('Full name is required');
    error.statusCode = 400;
    throw error;
  }
  if (!email || !email.trim()) {
    const error = new Error('Valid email address is required');
    error.statusCode = 400;
    throw error;
  }
  if (!password || password.length < 6) {
    const error = new Error('Password must be at least 6 characters');
    error.statusCode = 400;
    throw error;
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (existingUser) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  // Issue JWT Token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, name: newUser.name, role: 'user' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    token,
    user: newUser,
  };
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: 'user' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
  };
}

async function forgotPassword({ email }) {
  if (!email || !email.trim()) {
    const error = new Error('Email is required');
    error.statusCode = 400;
    throw error;
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (!user) {
    const error = new Error('No user account found with that email address');
    error.statusCode = 404;
    throw error;
  }

  // Generate a memorable 6-digit verification code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetCode,
      resetPasswordExpires: expiresAt,
    },
  });

  console.log(`[ForgotPassword] Password reset code for ${cleanEmail}: ${resetCode}`);

  return {
    success: true,
    message: 'Password reset code generated. Use the 6-digit code to reset your password.',
    resetCode,
    expiresAt,
  };
}

async function resetPassword({ tokenOrCode, newPassword }) {
  if (!tokenOrCode || !tokenOrCode.trim()) {
    const error = new Error('Reset code is required');
    error.statusCode = 400;
    throw error;
  }
  if (!newPassword || newPassword.length < 6) {
    const error = new Error('New password must be at least 6 characters');
    error.statusCode = 400;
    throw error;
  }

  const code = tokenOrCode.trim();
  const now = new Date();

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: code,
      resetPasswordExpires: {
        gt: now,
      },
    },
  });

  if (!user) {
    const error = new Error('Invalid or expired password reset code. Please request a new code.');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return {
    success: true,
    message: 'Password has been reset successfully! You can now sign in with your new password.',
  };
}

async function getUserProfile(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

async function updateUserProfile(id, { name, avatarUrl }) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  if (name !== undefined) {
    if (!name || !name.trim()) {
      const error = new Error('Name cannot be empty');
      error.statusCode = 400;
      throw error;
    }
    updateData.name = name.trim();
  }
  if (avatarUrl !== undefined) {
    updateData.avatarUrl = avatarUrl ? avatarUrl.trim() : null;
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
}

async function changeUserPassword(id, { currentPassword, newPassword }) {
  if (!currentPassword || !newPassword) {
    const error = new Error('Both current password and new password are required');
    error.statusCode = 400;
    throw error;
  }
  if (newPassword.length < 6) {
    const error = new Error('New password must be at least 6 characters long');
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error('Incorrect current password');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return { success: true, message: 'Password updated successfully!' };
}

module.exports = {
  loginAdmin,
  getAdminProfile,
  changePassword,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
};
