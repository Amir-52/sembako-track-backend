const db = require('../models');

// GET all products
 const getAllProducts = async (req, res) => {
    try {
        const products = await 
        db.Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ 
            message: "Gagal mengambil data produk",
            error: error.message
        });
    }
};

// Add new product
const createProduct = async (req, res) => {
    try {
        const { nama, stok, harga_jual } = req.body;
        const newProduct = await db.Product.create
        ({ nama, stok, harga_jual });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({
            message: "Gagal menambahkan produk",
            error: error.message
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await db.Product.update(req.body,
            { where: { id } });
            res.json({ message: "Produk berhasil diperbarui" });
    } catch (error) {
        res.status(400).json({ message: "Gagal memperbarui produk", 
            error: error.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await db.Product.findByPk(id);
        if (!product){
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        await product.destroy();

        res.json({ message: `Produk ${product.nama} berhasil dihapus` });
    } catch (error){
        res.status(500).json
        ({ message: "Gagal menghapus produk", error: error.message });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
};