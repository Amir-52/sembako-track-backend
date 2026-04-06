const express = require('express');
const cors = require('cors');
const db = require('./models');
const transactionRoutes = require('./routes/transactionRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

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