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
    nama: DataTypes.STRING,
    stok: DataTypes.INTEGER,
    harga_jual: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true,
  });
  return Product;
};