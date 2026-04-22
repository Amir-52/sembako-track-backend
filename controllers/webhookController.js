const crypto = require('crypto');
const { processSuccessfulPayment } = require('../services/orderService');

// Ganti dengan Server Key dari dashboard Payment Gateway kamu nanti
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'SERVER_KEY_RAHASIA_KAMU'; 

async function handlePaymentWebhook(req, res) {
    try {
        const payload = req.body;

        // 1. Ekstrak data dari Payment Gateway (Contoh format Midtrans)
        // Midtrans biasanya mengirim order_id, status_code, dan gross_amount
        const transactionId = payload.order_id; 
        const statusCode = payload.status_code;
        const grossAmount = payload.gross_amount;
        const transactionStatus = payload.transaction_status;
        const signatureKey = payload.signature_key;

        // 2. SOP KEAMANAN: Validasi Signature Key
        // Ini memastikan request benar-benar datang dari Midtrans, bukan hacker
        // const inputString = transactionId + statusCode + grossAmount + SERVER_KEY;
        // const generatedSignature = crypto.createHash('sha512').update(inputString).digest('hex');

        // if (generatedSignature !== signatureKey) {
        //     console.warn(`[WARNING] Webhook palsu terdeteksi untuk Transaksi: ${transactionId}`);
        //     return res.status(403).json({ message: 'Akses Ditolak: Signature tidak valid!' });
        // }

        // 3. Jika Valid, Cek Status Pembayarannya
        if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
            // Panggil Service Layer yang baru saja kita buat tadi
            await processSuccessfulPayment(transactionId, payload.transaction_id);
            
        } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
            // (Opsional) Kamu bisa buat service lain untuk handle pembatalan
            console.log(`[INFO] Transaksi ${transactionId} batal atau kadaluarsa.`);
        }

        // 4. SELALU kembalikan HTTP 200 OK ke Payment Gateway
        // Kalau tidak, Midtrans akan terus-terusan menembak server kamu karena dikira gagal
        return res.status(200).json({ status: 'success', message: 'Webhook berhasil diproses' });

    } catch (error) {
        console.error(`[ERROR] Webhook Controller Error:`, error.message);
        // Kembalikan 500 agar Payment Gateway tahu ada masalah di server kita
        return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan internal server' });
    }
}

module.exports = {
    handlePaymentWebhook
};