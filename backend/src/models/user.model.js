import pool from '../config/db.js';

export async function createUser({
  company_name,
  name,
  email,
  phone,
  password,
  role = 'EMPLOYEE',
  login_id,
}) {
  const sql = `
    INSERT INTO users (company_name, name, email, phone, password, role, login_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    company_name || null,
    name,
    email,
    phone || null,
    password,
    role,
    login_id || null,
  ];

  const [result] = await pool.execute(sql, params);
  return { id: result.insertId };
}

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

export async function findUserByLoginId(login_id) {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE login_id = ? LIMIT 1',
    [login_id]
  );
  return rows[0] || null;
}
