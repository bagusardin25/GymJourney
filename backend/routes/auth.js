import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...safeUser } = user;

  res.json({
    message: 'Login successful',
    token,
    user: safeUser
  });
});

// Register
router.post('/register', (req, res) => {
  const { name, email, password, membership = 'Bronze' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = uuidv4();

  try {
    db.prepare(`
      INSERT INTO users (id, name, email, password, membership)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, name, email, hashedPassword, membership);

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = newUser;

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Get current user profile
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update user profile
router.put('/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, membership, status } = req.body;

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (membership) {
      updates.push('membership = ?');
      values.push(membership);
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length > 0) {
      values.push(decoded.id);
      db.prepare(`
        UPDATE users SET ${updates.join(', ')} WHERE id = ?
      `).run(...values);
    }

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);
    const { password: _, ...safeUser } = updatedUser;

    res.json({
      message: 'Profile updated successfully',
      user: safeUser
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Get all members (admin only)
router.get('/members', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const members = db.prepare(`
      SELECT id, name, email, membership, status, join_date, created_at
      FROM users WHERE role = 'member'
    `).all();

    res.json({ members });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
