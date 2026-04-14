const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Mapping route POST /login ke fungsi login di authController
router.post('/login', authController.login);

// Route baru untuk register
router.post('/register', authController.register);

module.exports = router;