const sequelize = require('../config/db');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// --- Associations ---
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasOne(Store, { foreignKey: 'owner_id', as: 'ownedStore' });

Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
User.hasMany(Rating, { foreignKey: 'user_id', as: 'ratings' });
Store.hasMany(Rating, { foreignKey: 'store_id', as: 'ratings' });

module.exports = { sequelize, User, Store, Rating };