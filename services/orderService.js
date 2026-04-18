const { sequelize, Transaction, TransactionItem, Product, StockMutation } = require('../models');

// Fungsi ini akan dipanggil saat Webhook Midtrans/Xendit mengabarkan status LUNAS
async function processSuccessfulPayment(transactionId, paymentReference) {
    // 1. Buka Transaksi Database (Sequelize Transaction)
    const t = await sequelize.transaction();

    try {
        // 2. Cari data transaksi beserta detail barangnya
        const transactionRecord = await Transaction.findOne({
            where: { id: transactionId },
            // Pastikan di model Transaction kamu menambahkan: hasMany(models.TransactionItem, { as: 'items' })
            include: [{ model: TransactionItem, as: 'items' }], 
            transaction: t
        });

        if (!transactionRecord) throw new Error('Transaksi tidak ditemukan di sistem.');
        
        if (transactionRecord.status === 'PAID') {
            console.log(`[INFO] Transaksi ${transactionId} sudah pernah diproses (Lunas).`);
            await t.rollback(); // Batalkan proses karena sudah lunas sebelumnya
            return;
        }

        // 3. Update status transaksi jadi LUNAS
        await transactionRecord.update({ status: 'PAID' }, { transaction: t });

        // 4. Proses setiap barang yang dibeli untuk memotong stok dan mencatat mutasi
        for (const item of transactionRecord.items) {
            
            // ROW-LEVEL LOCKING: Cegah race condition
            // Karena di model TransactionItem kamu menulis "productId", panggilnya item.productId
            const product = await Product.findOne({
                where: { id: item.productId },
                transaction: t,
                lock: t.LOCK.UPDATE 
            });

            if (!product) throw new Error(`Data produk tidak valid.`);
            
            // Validasi stok cukup
            if (product.stok < item.quantity) {
                throw new Error(`Stok ${product.name} tidak cukup! Sisa: ${product.stok}`);
            }

            // A. Kurangi stok utama di tabel Product
            await product.decrement('stok', {
                by: item.quantity,
                transaction: t
            });

            // B. Catat sejarahnya di Audit Trail (Tabel StockMutation)
            await StockMutation.create({
                product_id: item.productId, // Dari TransactionItem
                mutation_type: 'OUT',
                quantity: item.quantity,
                reference_id: paymentReference || transactionRecord.id,
            }, { transaction: t });
        }

        // 5. Simpan semua perubahan secara permanen (Commit)
        await t.commit();
        console.log(`[SUCCESS] Pembayaran berhasil. Mutasi stok dicatat untuk Transaksi ID: ${transactionId}`);

    } catch (error) {
        // 6. Jika ada 1 saja yang error, batalkan SEMUANYA (Rollback)
        await t.rollback();
        console.error(`[FAILED] Gagal memproses pembayaran. Transaksi dibatalkan. Detail:`, error.message);
        throw error; // Lempar error ke Controller
    }
}

module.exports = {
    processSuccessfulPayment
};