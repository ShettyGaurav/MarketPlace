const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../../config/database');
const { logger } = require('../../../utils/logger.js');

const register = async ({ email, password, name, role = 'USER' }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    logger.info(`Creating user with email: ${email}`);
    const query = `
      INSERT INTO users (email, password, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, role
    `;
    const result = await pool.query(query, [email, hashedPassword, name, role]);
    return result.rows[0];
  } catch (error) {
    logger.error('Error registering user:', error);
    throw new Error('Failed to register user');
  }
};

const login = async ({ email, password }) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    logger.info(`User logged in: ${email}`);
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  } catch (error) {
    logger.error('Error logging in:', error);
    throw new Error('Invalid credentials');
  }
};

const refresh = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [decoded.id]);
    const user = result.rows[0];
    if (!user) {
      throw new Error('User not found');
    }
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    return { accessToken };
  } catch (error) {
    logger.error('Refresh token error:', error);
    throw new Error('Invalid refresh token');
  }
};

module.exports = { register, login, refresh };