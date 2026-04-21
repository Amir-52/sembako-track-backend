const express = require('express');
const cors = require('cors');
const db = require('./models');

// import routes
const transactionRoutes = require('./routes/transactionRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/webhooks', webhookRoutes);

// Langsung jalankan server, database biarkan diurus oleh Migration
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});