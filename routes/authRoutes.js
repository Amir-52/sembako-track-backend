const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Mapping route POST /login ke fungsi login di authController
router.post('/login', authController.login);

module.exports = router;