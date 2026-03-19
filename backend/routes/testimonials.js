import express from 'express';
import db from './database.js';

const router = express.Router();

// Get all testimonials
router.get('/', (req, res) => {
  const testimonials = db.prepare('SELECT * FROM testimonials').all();
  res.json({ testimonials });
});

// Create testimonial (admin only)
router.post('/', (req, res) => {
  const { name, quote, rating = 5, image = '' } = req.body;

  if (!name || !quote) {
    return res.status(400).json({ message: 'Name and quote are required' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO testimonials (name, quote, rating, image)
      VALUES (?, ?, ?, ?)
    `).run(name, quote, rating, image);

    const newTestimonial = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Testimonial created successfully', testimonial: newTestimonial });
  } catch (error) {
    res.status(500).json({ message: 'Error creating testimonial', error: error.message });
  }
});

// Update testimonial (admin only)
router.put('/:id', (req, res) => {
  const { name, quote, rating, image } = req.body;

  const existingTestimonial = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);

  if (!existingTestimonial) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }

  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (quote !== undefined) {
    updates.push('quote = ?');
    values.push(quote);
  }
  if (rating !== undefined) {
    updates.push('rating = ?');
    values.push(rating);
  }
  if (image !== undefined) {
    updates.push('image = ?');
    values.push(image);
  }

  if (updates.length > 0) {
    values.push(req.params.id);
    db.prepare(`
      UPDATE testimonials SET ${updates.join(', ')} WHERE id = ?
    `).run(...values);
  }

  const updatedTestimonial = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
  res.json({ message: 'Testimonial updated successfully', testimonial: updatedTestimonial });
});

// Delete testimonial (admin only)
router.delete('/:id', (req, res) => {
  const existingTestimonial = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);

  if (!existingTestimonial) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }

  db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
  res.json({ message: 'Testimonial deleted successfully' });
});

export default router;
