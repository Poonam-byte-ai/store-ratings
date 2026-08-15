const { Sequelize } = require('sequelize');
require('dotenv').config();

// Single Sequelize instance shared across the whole app.
// Sequelize is an ORM: it lets us define JS classes (models) instead of
// writing raw SQL for every query, and it builds/runs the SQL for us.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // set to console.log if you want to see generated SQL while debugging
  }
);

module.exports = sequelize;