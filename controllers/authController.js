const db = require('../models');
const bcrypt = require('bcryptjs'); // Menggunakan bcryptjs sesuai kodemu
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_sembako_super_aman_123';

// ==========================================
// FITUR LOGIN (Kode aslimu)
// ==========================================
const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [results] = await db.sequelize.query(
            'SELECT * FROM "Users" WHERE username = :username',
            { replacements: { username: username } }
        );
        
        if (results.length === 0) {
            return res.status(400).json({ message: "Username tidak ditemukan!" });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password salah!" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );
        
        res.json({ 
            message: "Login berhasil",
            token: token, 
            user: { username: user.username, role: user.role } 
        });

    } catch (err) {
        console.error("Error di sistem login:", err.message);
        res.status(500).json({ message: "Terjadi kesalahan pada server database" });
    }
};


// ==========================================
// FITUR REGISTER (Baru ditambahkan)
// ==========================================
const register = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // 1. Cek apakah username sudah ada di database
        const [existingUsers] = await db.sequelize.query(
            'SELECT * FROM "Users" WHERE username = :username',
            { replacements: { username: username } }
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Username sudah digunakan!" });
        }

        // 2. Acak (Hash) Password menggunakan bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Simpan data ke database menggunakan Raw Query
        // Kita memberikan role 'kasir' sebagai default untuk akun yang didaftarkan
        await db.sequelize.query(
            'INSERT INTO "Users" (username, password, role, "createdAt", "updatedAt") VALUES (:username, :password, :role, NOW(), NOW())',
            { 
                replacements: { 
                    username: username, 
                    password: hashedPassword,
                    role: 'kasir' 
                } 
            }
        );
        
        res.status(201).json({ message: "Registrasi berhasil!" });

    } catch (err) {
        console.error("Error di sistem register:", err.message);
        res.status(500).json({ message: "Terjadi kesalahan saat menyimpan data ke database" });
    }
};

module.exports = {
    login,
    register // Jangan lupa mengekspor fungsi baru ini!
};