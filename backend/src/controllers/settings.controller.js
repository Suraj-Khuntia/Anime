const settingsService = require('../services/settings.service');

async function getSettings(req, res, next) {
  try {
    const data = settingsService.getSettings();
    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function updateSettings(req, res, next) {
  try {
    const updated = settingsService.updateSettings(req.body);
    return res.json({
      success: true,
      message: 'Platform settings updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

async function resetSettings(req, res, next) {
  try {
    const defaults = settingsService.resetSettings();
    return res.json({
      success: true,
      message: 'Platform settings restored to defaults',
      data: defaults,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  updateSettings,
  resetSettings,
};
