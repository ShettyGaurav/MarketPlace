const express = require('express');
const { authenticate } = require('../../auth/middlewares/auth.middleware');
const { getMessagesController } = require('../controllers/chat.controller');
const router = express.Router();

router.get('/messages', authenticate, getMessagesController);

module.exports = router;