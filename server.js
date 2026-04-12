const express = require('express');
const cors = require('cors');
const db = require('./models');
const transactionRoutes = require('./routes/transactionRoutes');
const productRoutes = require('./routes/productRoutes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'rahasia_sembako_super_aman_123';

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// ENDPOINT LOGIN KASIR / ADMIN
// ==========================================
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // 1. Cari user pakai Sequelize Raw Query (Lebih aman dan rapi)
        const [results] = await db.sequelize.query(
            'SELECT * FROM "Users" WHERE username = :username',
            {
                replacements: { username: username }
            }
        );
        
        // Jika username tidak ada di tabel
        if (results.length === 0) {
            return res.status(400).json({ message: "Username tidak ditemukan!" });
        }

        const user = results[0];

        // 2. Cocokkan password yang diketik dengan password acak di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password salah!" });
        }

        // 3. Jika cocok, buatkan "Tiket Masuk" (Token) yang berlaku 1 hari
        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );
        
        // 4. Kirim token ke React
        res.json({ 
            message: "Login berhasil",
            token: token, 
            user: { username: user.username, role: user.role } 
        });

    } catch (err) {
        console.error("Error di sistem login:", err.message);
        res.status(500).json({ message: "Terjadi kesalahan pada server database" });
    }
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);

db.sequelize.sync()
    .then(() => {
   app.listen(PORT, () =>
    console.log(`Server berjalan di port ${PORT}`));
    })
    .catch(err => {
        console.error("Gagal menyinkronkan database:", err.message);
    });