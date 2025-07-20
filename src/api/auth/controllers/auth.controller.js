const { register, login, refresh } = require('../services/auth.service');
const { logger } = require('../../../utils/logger.js');

const registerController = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    const user = await register({ email, password, name, role });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await login({ email, password });
    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
};

const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const { accessToken } = await refresh(refreshToken);
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerController, loginController, refreshController };