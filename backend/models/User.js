const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// This model maps directly to the `users` table.
// role decides what the person can do — this is the core of your
// "single login, different access" requirement.
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: { args: [20, 60], msg: 'Name must be between 20 and 60 characters' },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: { msg: 'Must be a valid email' } },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false, // this stores the HASHED password, never plain text
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'normal', 'store_owner'),
    allowNull: false,
    defaultValue: 'normal',
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;