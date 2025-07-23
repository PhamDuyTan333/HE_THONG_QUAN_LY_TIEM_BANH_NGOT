const pool = require('../config/db');

exports.findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);
  return result.rows[0]; // trả về 1 account nếu tìm thấy
};

exports.findByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);
  return result.rows[0]; // trả về 1 account nếu tìm thấy
};

exports.getAll = async () => {
  const result = await pool.query('SELECT id, username, email, role, status, created_at FROM accounts');
  return result.rows;
};

exports.create = async (accountData) => {
  const { username, email, password, full_name, role, status } = accountData;
  const result = await pool.query(
    'INSERT INTO accounts (username, email, password, full_name, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [username, email, password, full_name, role, status]
  );
  return result.rows[0];
};

exports.findById = async (id) => {
  const result = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
  return result.rows[0];
};