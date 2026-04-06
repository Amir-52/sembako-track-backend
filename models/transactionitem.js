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
      this.belongsTo(models.Transaction, { foreignKey: 'transactionId' });
      this.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  TransactionItem.init({
    transactionId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    priceAtTransaction: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TransactionItem',
  });
  return TransactionItem;
};