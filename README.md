# 📦 Sembako-Track Backend

Aplikasi API untuk manajemen stok sembako dan transaksi otomatis.

## ✨ Fitur Utama
- **CRUD Produk**: Tambah, edit, lihat, dan hapus barang sembako.
- **Transaksi Otomatis**: Stok barang otomatis berkurang saat ada penjualan.
- **Database**: Menggunakan PostgreSQL dengan Sequelize ORM.

## 🚀 Cara Menjalankan
1. `npm install`
2. Sesuaikan konfigurasi database di `.env`
3. `npx sequelize-cli db:migrate`
4. `npm start`

## 🛠 Tech Stack
- Node.js, Express, PostgreSQL, Sequelize.