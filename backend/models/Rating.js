const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
}, {
  tableName: 'ratings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    // one rating per (user, store) pair — this is what lets us treat a
    // second submission as an "update" instead of a duplicate row
    { unique: true, fields: ['user_id', 'store_id'] },
  ],
});

module.exports = Rating;