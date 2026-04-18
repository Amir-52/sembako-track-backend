'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Transaction, { foreignKey: 'transaction_id' });
      this.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }
  TransactionItem.init({
    transaction_id: DataTypes.UUID,
    product_id: DataTypes.UUID,
    quantity: DataTypes.INTEGER,
    priceAtTransaction: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TransactionItem',
    tableName: 'transaction_items',
    underscored: true,
  });
  return TransactionItem;
};