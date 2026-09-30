const authService = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const usernameOrEmail = username || email;
    const result = await authService.loginAdmin({ usernameOrEmail, password });
    return res.json({
      success: true,
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const profile = await authService.getAdminProfile(req.admin.id);
    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

async function updatePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.admin.id, { oldPassword, newPassword });
    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

// Regular User Handlers

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerUser({ name, email, password });
    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function userLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return res.json({
      success: true,
      message: 'Signed in successfully!',
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword({ email });
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, code, newPassword } = req.body;
    const tokenOrCode = token || code;
    const result = await authService.resetPassword({ tokenOrCode, newPassword });
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getUserMe(req, res, next) {
  try {
    const profile = await authService.getUserProfile(req.user.id);
    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

async function updateUserProfile(req, res, next) {
  try {
    const { name, avatarUrl } = req.body;
    const updated = await authService.updateUserProfile(req.user.id, { name, avatarUrl });
    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

async function changeUserPassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changeUserPassword(req.user.id, { currentPassword, newPassword });
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  getMe,
  updatePassword,
  register,
  userLogin,
  forgotPassword,
  resetPassword,
  getUserMe,
  updateUserProfile,
  changeUserPassword,
};
