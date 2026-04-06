const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Mapping route ke fungsi controller
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;