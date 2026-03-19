import express from 'express';
import db from './database.js';

const router = express.Router();

// Get all classes
router.get('/', (req, res) => {
  const { category } = req.query;
  
  let query = 'SELECT * FROM classes';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  const classes = db.prepare(query).all(...params);
  res.json({ classes });
});

// Get class by ID
router.get('/:id', (req, res) => {
  const classItem = db.prepare('SELECT * FROM classes WHERE id = ?').get(req.params.id);

  if (!classItem) {
    return res.status(404).json({ message: 'Class not found' });
  }

  res.json({ class: classItem });
});

// Create new class (admin only)
router.post('/', (req, res) => {
  const { name, instructor, time, spots, category, description = '' } = req.body;

  if (!name || !instructor || !time || !spots || !category) {
    return res.status(400).json({ message: 'Name, instructor, time, spots, and category are required' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO classes (name, instructor, time, spots, booked, category, description)
      VALUES (?, ?, ?, ?, 0, ?, ?)
    `).run(name, instructor, time, spots, category, description);

    const newClass = db.prepare('SELECT * FROM classes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
});

// Update class (admin only)
router.put('/:id', (req, res) => {
  const { name, instructor, time, spots, category, description, booked } = req.body;

  const existingClass = db.prepare('SELECT * FROM classes WHERE id = ?').get(req.params.id);

  if (!existingClass) {
    return res.status(404).json({ message: 'Class not found' });
  }

  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (instructor !== undefined) {
    updates.push('instructor = ?');
    values.push(instructor);
  }
  if (time !== undefined) {
    updates.push('time = ?');
    values.push(time);
  }
  if (spots !== undefined) {
    updates.push('spots = ?');
    values.push(spots);
  }
  if (category !== undefined) {
    updates.push('category = ?');
    values.push(category);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description);
  }
  if (booked !== undefined) {
    updates.push('booked = ?');
    values.push(booked);
  }

  if (updates.length > 0) {
    values.push(req.params.id);
    db.prepare(`
      UPDATE classes SET ${updates.join(', ')} WHERE id = ?
    `).run(...values);
  }

  const updatedClass = db.prepare('SELECT * FROM classes WHERE id = ?').get(req.params.id);
  res.json({ message: 'Class updated successfully', class: updatedClass });
});

// Delete class (admin only)
router.delete('/:id', (req, res) => {
  const existingClass = db.prepare('SELECT * FROM classes WHERE id = ?').get(req.params.id);

  if (!existingClass) {
    return res.status(404).json({ message: 'Class not found' });
  }

  db.prepare('DELETE FROM classes WHERE id = ?').run(req.params.id);
  res.json({ message: 'Class deleted successfully' });
});

export default router;
