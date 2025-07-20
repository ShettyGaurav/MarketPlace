const express = require('express');
const { registerController, loginController, refreshController } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshController);

module.exports = router;