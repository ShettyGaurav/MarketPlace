const pool = require('../../../config/database');
const { logger } = require('../../../utils/logger');

const saveMessage = async ({ senderId, receiverId, content }) => {
  try {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, sender_id, receiver_id, content, created_at
    `;
    const result = await pool.query(query, [senderId, receiverId, content]);
    logger.info(`Message saved from ${senderId} to ${receiverId}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error saving message:', error);
    throw new Error('Failed to save message');
  }
};

const getMessages = async (userId1, userId2) => {
  try {
    const query = `
      SELECT id, sender_id, receiver_id, content, created_at
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
    `;
    const result = await pool.query(query, [userId1, userId2]);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages');
  }
};

module.exports = { saveMessage, getMessages };