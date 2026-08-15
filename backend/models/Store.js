const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
  },
  owner_id: {
    // Links this store to the User row (role = 'store_owner') who owns it.
    // Nullable because an admin might create a store before assigning an owner.
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'stores',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Store;