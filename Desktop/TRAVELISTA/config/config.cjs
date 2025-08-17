require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: '',
    database: 'travel_agency',
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  },
  test: {
    username: 'root',
    password: '',
    database: 'travel_agency_test',
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT
  }
}; 