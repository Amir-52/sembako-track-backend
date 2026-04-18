'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockMutation extends Model {
    static associate(models) {
      // Relasi dengan Product
      StockMutation.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'products'
      });
    }
  }
  StockMutation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    product_id: DataTypes.UUID,
    mutation_type: DataTypes.ENUM('IN', 'OUT', 'ADJUSTMENT'),
    quantity: DataTypes.INTEGER,
    reference_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StockMutation',
    tableName: 'stock_mutations',
    updatedAt: false // Nonaktifkan updatedAt
  });
  return StockMutation;
};