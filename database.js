const { Pool } = require('pg');

const pool = new Pool({
  user: 'coin_desk-scrapper',
  password: 'localhost',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'CoinDesk'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};