const express = require('express');
const router = express.Router();

// Import controller webhook yang sudah kamu buat
const { handlePaymentWebhook } = require('../controllers/webhookController');

// Route untuk menerima webhook dari Midtrans/Xendit
router.post('/payment', handlePaymentWebhook);

module.exports = router;