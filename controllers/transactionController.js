const { Transaction, TransactionItem, Product, sequelize } = require('../models');

const createTransaction = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { items } = req.body;
        let totalAmount = 0;

        const newTransaction = await Transaction.create({
            date: new Date(),
            totalPrice: 0
        }, { transaction: t });

        for (const item of items) {
            const product = await 
            Product.findByPk(item.productId, { transaction: t });

           const harga = product.harga_jual;
           const stokNow = product.stok;
           if (stokNow < item.quantity) {
                throw new Error(`Stok ${product.nama} 
                    tidak cukup! Sisanya hanya ${stokNow} `);
            }

            const subtotal = harga * item.quantity;
            totalAmount += subtotal;

            await TransactionItem.create({
                transactionId: newTransaction.id,
                productId: item.productId,
                quantity: item.quantity,
                priceAtTransaction: harga
            }, { transaction: t });

            
            await product.update({
                stok: stokNow - item.quantity
            }, { transaction: t });
        }
        
        await newTransaction.update({
            totalPrice: totalAmount
        }, { transaction: t });

        await t.commit();

        res.status(201).json({
            message: 'Transaksi berhasil dan stok telah dikurangi.', 
            data: newTransaction
        });
    } catch (error) {
        await t.rollback();
        res.status(400).json({
            message: "Transaksi gagal dilakukan", 
            error: error.message
        });
    }
}

module.exports = { createTransaction };