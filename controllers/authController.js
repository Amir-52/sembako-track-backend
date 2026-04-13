const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'rahasia_sembako_super_aman_123'; // Pindahkan kuncinya ke sini

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

module.exports = {
    login
};