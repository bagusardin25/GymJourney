import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../database.js';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user's payment history
router.get('/my-payments', verifyToken, (req, res) => {
  const payments = db.prepare(`
    SELECT * FROM payments
    WHERE user_id = ?
    ORDER BY payment_date DESC
  `).all(req.user.id);

  res.json({ payments });
});

// Create payment record (admin only)
router.post('/', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { userId, amount, plan, status = 'Paid', paymentDate } = req.body;

  if (!userId || !amount || !plan) {
    return res.status(400).json({ message: 'User ID, amount, and plan are required' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO payments (user_id, amount, plan, status, payment_date)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, amount, plan, status, paymentDate || new Date().toISOString().split('T')[0]);

    const newPayment = db.prepare('SELECT * FROM payments WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Payment recorded successfully', payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Error recording payment', error: error.message });
  }
});

// Get all payments (admin only)
router.get('/', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const payments = db.prepare(`
    SELECT p.*, u.name as user_name, u.email as user_email
    FROM payments p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.payment_date DESC
  `).all();

  res.json({ payments });
});

// Update payment status (admin only)
router.put('/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { status } = req.body;

  const existingPayment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);

  if (!existingPayment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  db.prepare('UPDATE payments SET status = ? WHERE id = ?').run(status, req.params.id);

  const updatedPayment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
  res.json({ message: 'Payment updated successfully', payment: updatedPayment });
});

export default router;
