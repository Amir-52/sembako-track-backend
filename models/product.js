'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.StockMutation, {
        foreignKey: 'product_id',
        as: 'mutations'
      });
    }
  }
  Product.init({
    // 1. TAMBAHKAN BLOK ID INI AGAR OTOMATIS TERISI
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    nama: DataTypes.STRING,
    harga_jual: DataTypes.INTEGER,
    stok: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products', // 2. TAMBAHKAN INI AGAR HURUF KECIL SEMUA
  });
  return Product;
};