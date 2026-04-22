const { Product, Transaction, TransactionItem } = require('./models');

async function buatDataCepat() {
    try {
        console.log("Membuat data pancingan...");

        // 1. Bikin Produk
        const produk = await Product.create({
            nama: 'Beras SPHP 5Kg',
            harga_jual: 75000,
            stok: 50
        });

        // 2. Bikin Transaksi (Status PENDING)
        const transaksi = await Transaction.create({
            totalPrice: 150000,
            date: new Date()
        });

        // 3. Masukkan ke Keranjang (Transaction Item)
        await TransactionItem.create({
            transactionId: transaksi.id, 
            productId: produk.id,
            quantity: 2,
            priceAtTransaction: 75000
        });

        console.log("\n✅ [SUKSES] Data berhasil masuk Database!");
        console.log("==================================================");
        console.log(transaksi.id);
        console.log("==================================================");
        console.log("👆 COPY TULISAN PANJANG DI ATAS UNTUK POSTMAN 👆\n");

        process.exit();
    } catch (error) {
        console.error("Gagal bos:", error.message);
        process.exit(1);
    }
}

buatDataCepat();