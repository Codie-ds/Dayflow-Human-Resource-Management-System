import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  createUser,
  findUserByEmail,
  findUserByLoginId,
} from '../models/user.model.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS
  ? Number(process.env.BCRYPT_SALT_ROUNDS)
  : 10;

/**
 * Remove sensitive fields before sending user data
 */
function sanitizeUser(userRow) {
  if (!userRow) return null;
  const { password, ...user } = userRow;
  return user;
}

/**
 * ADMIN REGISTRATION (ONLY FOR INITIAL SETUP)
 * Later, Admin/HR will create users via a separate API
 */
export async function registerAdmin(req, res) {
  try {
    const { company_name, name, email, password, phone, login_id } = req.body;

    if (!company_name || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'company_name, name, email and password are required',
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const { id } = await createUser({
      company_name,
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'ADMIN',
      login_id,
    });

    return res.status(201).json({
      success: true,
      data: {
        id,
        company_name,
        name,
        email,
        role: 'ADMIN',
      },
    });
  } catch (err) {
    console.error('registerAdmin error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * LOGIN USER
 * Supports Email OR Login ID
 * Handles FIRST LOGIN → force password change
 */
export async function loginUser(req, res) {
  try {
    const { email, login_id, password } = req.body;

    if ((!email && !login_id) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/Login ID and password required',
      });
    }

    // 🔍 Find user
    const userRow = email
      ? await findUserByEmail(email)
      : await findUserByLoginId(login_id);

    if (!userRow) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // 🔐 Verify password
    const isMatch = await bcrypt.compare(password, userRow.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // 🎟 Generate JWT
    const token = jwt.sign(
      {
        id: userRow.id,
        role: userRow.role,
        company_name: userRow.company_name,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const user = sanitizeUser(userRow);

    // 🚨 FIRST LOGIN CHECK (IMPORTANT)
    if (userRow.is_first_login || userRow.must_change_password) {
      return res.status(200).json({
        success: true,
        mustChangePassword: true,
        data: {
          user,
          token,
        },
      });
    }

    // ✅ NORMAL LOGIN
    return res.status(200).json({
      success: true,
      mustChangePassword: false,
      data: {
        user,
        token,
      },
    });

  } catch (err) {
    console.error('loginUser error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
