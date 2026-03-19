import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'setiakawan.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    membership TEXT DEFAULT 'Bronze',
    join_date TEXT DEFAULT (date('now')),
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    instructor TEXT NOT NULL,
    time TEXT NOT NULL,
    spots INTEGER NOT NULL,
    booked INTEGER DEFAULT 0,
    category TEXT NOT NULL,
    description TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    class_id INTEGER NOT NULL,
    booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'confirmed',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE(user_id, class_id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    plan TEXT NOT NULL,
    status TEXT DEFAULT 'Paid',
    payment_date TEXT DEFAULT (date('now')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    image TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create default admin user
const adminExists = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@setiakawan.com');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO users (id, name, email, password, role, membership)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('admin-1', 'Admin SetiaKawan', 'admin@setiakawan.com', hashedPassword, 'admin', 'Platinum');
}

// Create default member user
const memberExists = db.prepare('SELECT * FROM users WHERE email = ?').get('member@setiakawan.com');
if (!memberExists) {
  const hashedPassword = bcrypt.hashSync('member123', 10);
  db.prepare(`
    INSERT INTO users (id, name, email, password, role, membership)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('member-1', 'Member SetiaKawan', 'member@setiakawan.com', hashedPassword, 'member', 'Gold');
}

// Seed classes data
const classesCount = db.prepare('SELECT COUNT(*) as count FROM classes').get().count;
if (classesCount === 0) {
  const classes = [
    { name: 'Ashtanga Yoga', instructor: 'Sarah Lee', time: 'Mon 6:00 AM - 7:00 AM', spots: 15, booked: 12, category: 'Yoga', description: 'A dynamic form of yoga that links breath with movement through a series of postures.' },
    { name: 'HIIT Circuit', instructor: 'John David', time: 'Mon 7:00 PM - 8:00 PM', spots: 20, booked: 20, category: 'Cardio', description: 'High-Intensity Interval Training to maximize calorie burn and improve cardiovascular health.' },
    { name: 'Powerlifting 101', instructor: 'Mike Ross', time: 'Tue 5:00 PM - 6:30 PM', spots: 10, booked: 7, category: 'Strength', description: 'Learn the fundamentals of powerlifting with proper form and technique.' },
    { name: 'Zumba Dance', instructor: 'Maria Garcia', time: 'Wed 6:30 PM - 7:30 PM', spots: 25, booked: 18, category: 'Cardio', description: 'Dance your way to fitness with energetic Latin-inspired routines.' },
    { name: 'Indoor Cycling', instructor: 'Chris Allen', time: 'Thu 7:00 AM - 7:45 AM', spots: 18, booked: 18, category: 'Cardio', description: 'High-energy cycling class set to motivating music.' },
    { name: 'Advanced Pilates', instructor: 'Emily Chen', time: 'Fri 12:00 PM - 1:00 PM', spots: 12, booked: 5, category: 'Flexibility', description: 'Strengthen your core and improve flexibility with advanced Pilates movements.' },
    { name: 'Boxing Basics', instructor: 'David Rodriguez', time: 'Sat 11:00 AM - 12:00 PM', spots: 16, booked: 14, category: 'Strength', description: 'Learn fundamental boxing techniques while getting a full-body workout.' },
    { name: 'Restorative Yoga', instructor: 'Sarah Lee', time: 'Sun 4:00 PM - 5:00 PM', spots: 15, booked: 9, category: 'Yoga', description: 'Gentle yoga poses held for longer periods to promote deep relaxation.' },
  ];

  const insertClass = db.prepare(`
    INSERT INTO classes (name, instructor, time, spots, booked, category, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const cls of classes) {
    insertClass.run(cls.name, cls.instructor, cls.time, cls.spots, cls.booked, cls.category, cls.description);
  }
}

// Seed testimonials
const testimonialsCount = db.prepare('SELECT COUNT(*) as count FROM testimonials').get().count;
if (testimonialsCount === 0) {
  const testimonials = [
    { name: 'Jessica M.', quote: 'SetiaKawan changed my life! The trainers are so supportive and the community is amazing.', rating: 5, image: 'https://placehold.co/60x60/1F2937/FFFFFF?text=JM' },
    { name: 'David L.', quote: 'The variety of classes keeps me engaged. I can do HIIT one day and relaxing yoga the next.', rating: 5, image: 'https://placehold.co/60x60/1F2937/FFFFFF?text=DL' },
    { name: 'Samantha B.', quote: 'As a beginner, I was intimidated, but the Powerlifting 101 class was perfect.', rating: 4, image: 'https://placehold.co/60x60/1F2937/FFFFFF?text=SB' },
  ];

  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (name, quote, rating, image)
    VALUES (?, ?, ?, ?)
  `);

  for (const t of testimonials) {
    insertTestimonial.run(t.name, t.quote, t.rating, t.image);
  }
}

console.log('Database initialized successfully!');

export default db;
