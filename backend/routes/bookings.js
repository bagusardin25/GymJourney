import express from 'express';
import jwt from 'jsonwebtoken';
import db from './database.js';

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

// Get user's booked classes
router.get('/my-bookings', verifyToken, (req, res) => {
  const bookings = db.prepare(`
    SELECT c.*, b.booked_at, b.status as booking_status
    FROM bookings b
    JOIN classes c ON b.class_id = c.id
    WHERE b.user_id = ?
  `).all(req.user.id);

  res.json({ bookings });
});

// Book a class
router.post('/book', verifyToken, (req, res) => {
  const { classId } = req.body;

  if (!classId) {
    return res.status(400).json({ message: 'Class ID is required' });
  }

  const classItem = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId);

  if (!classItem) {
    return res.status(404).json({ message: 'Class not found' });
  }

  if (classItem.booked >= classItem.spots) {
    return res.status(400).json({ message: 'Class is fully booked' });
  }

  const existingBooking = db.prepare(
    'SELECT * FROM bookings WHERE user_id = ? AND class_id = ?'
  ).get(req.user.id, classId);

  if (existingBooking) {
    return res.status(400).json({ message: 'You have already booked this class' });
  }

  try {
    // Create booking
    db.prepare(`
      INSERT INTO bookings (user_id, class_id)
      VALUES (?, ?)
    `).run(req.user.id, classId);

    // Update class booked count
    db.prepare(`
      UPDATE classes SET booked = booked + 1 WHERE id = ?
    `).run(classId);

    const updatedClass = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId);
    res.status(201).json({
      message: 'Class booked successfully',
      class: updatedClass
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ message: 'You have already booked this class' });
    }
    res.status(500).json({ message: 'Error booking class', error: error.message });
  }
});

// Cancel booking
router.delete('/cancel/:classId', verifyToken, (req, res) => {
  const { classId } = req.params;

  const booking = db.prepare(
    'SELECT * FROM bookings WHERE user_id = ? AND class_id = ?'
  ).get(req.user.id, classId);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  try {
    // Delete booking
    db.prepare('DELETE FROM bookings WHERE user_id = ? AND class_id = ?').run(req.user.id, classId);

    // Update class booked count
    db.prepare(`
      UPDATE classes SET booked = booked - 1 WHERE id = ?
    `).run(classId);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
});

// Get all bookings (admin only)
router.get('/', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const bookings = db.prepare(`
    SELECT b.*, u.name as user_name, u.email as user_email, c.name as class_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN classes c ON b.class_id = c.id
  `).all();

  res.json({ bookings });
});

export default router;
