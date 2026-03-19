# SetiaKawan Gym - Backend API

Backend implementation for SetiaKawan Gym management system using Node.js, Express, and SQLite.

## Features

- **Authentication**: JWT-based login and registration
- **User Management**: Member and admin roles
- **Class Management**: Create, update, delete gym classes
- **Booking System**: Book and cancel class reservations
- **Payment Tracking**: Record and view payment history
- **Testimonials**: Manage customer testimonials

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for frontend communication

## Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the `backend` folder:
```env
PORT=5000
JWT_SECRET=your_secret_key_change_in_production
NODE_ENV=development
```

3. Initialize the database:
The database will be automatically created and seeded on first run.

## Running the Application

### Run Backend Only
```bash
npm run server
```

### Run Frontend Only
```bash
npm run dev
```

### Run Both (Recommended for Development)
```bash
npm run dev:all
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/me` | Update user profile | Yes |
| GET | `/api/auth/members` | Get all members (admin) | Yes (Admin) |

### Classes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/classes` | Get all classes | No |
| GET | `/api/classes/:id` | Get class by ID | No |
| POST | `/api/classes` | Create new class | Yes (Admin) |
| PUT | `/api/classes/:id` | Update class | Yes (Admin) |
| DELETE | `/api/classes/:id` | Delete class | Yes (Admin) |

### Bookings
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/bookings/my-bookings` | Get user's bookings | Yes |
| POST | `/api/bookings/book` | Book a class | Yes |
| DELETE | `/api/bookings/cancel/:classId` | Cancel booking | Yes |
| GET | `/api/bookings` | Get all bookings | Yes (Admin) |

### Payments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/payments/my-payments` | Get user's payments | Yes |
| GET | `/api/payments` | Get all payments | Yes (Admin) |
| POST | `/api/payments` | Record payment | Yes (Admin) |
| PUT | `/api/payments/:id` | Update payment | Yes (Admin) |

### Testimonials
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/testimonials` | Get all testimonials | No |
| POST | `/api/testimonials` | Create testimonial | Yes (Admin) |
| PUT | `/api/testimonials/:id` | Update testimonial | Yes (Admin) |
| DELETE | `/api/testimonials/:id` | Delete testimonial | Yes (Admin) |

## Default Users

After running the server for the first time, these default users will be created:

### Admin Account
- **Email**: admin@setiakawan.com
- **Password**: admin123
- **Role**: admin
- **Membership**: Platinum

### Member Account
- **Email**: member@setiakawan.com
- **Password**: member123
- **Role**: member
- **Membership**: Gold

## Database Schema

### Users
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `email` (TEXT, UNIQUE)
- `password` (TEXT, hashed)
- `role` (TEXT) - 'admin' or 'member'
- `membership` (TEXT) - 'Bronze', 'Silver', 'Gold', 'Platinum'
- `join_date` (TEXT)
- `status` (TEXT) - 'Active', 'Inactive'

### Classes
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT)
- `instructor` (TEXT)
- `time` (TEXT)
- `spots` (INTEGER)
- `booked` (INTEGER)
- `category` (TEXT)
- `description` (TEXT)

### Bookings
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (TEXT, FK)
- `class_id` (INTEGER, FK)
- `booked_at` (DATETIME)
- `status` (TEXT)

### Payments
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (TEXT, FK)
- `amount` (REAL)
- `plan` (TEXT)
- `status` (TEXT)
- `payment_date` (TEXT)

### Testimonials
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT)
- `quote` (TEXT)
- `rating` (INTEGER)
- `image` (TEXT)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `JWT_SECRET` | JWT signing secret | (required) |
| `NODE_ENV` | Environment | development |

## Project Structure

```
setiakawan_gym/
├── backend/
│   ├── server.js          # Main server file
│   ├── database.js        # Database initialization
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   ├── classes.js     # Classes routes
│   │   ├── bookings.js    # Bookings routes
│   │   ├── payments.js    # Payments routes
│   │   └── testimonials.js # Testimonials routes
│   └── setiakawan.db      # SQLite database (auto-created)
├── src/
│   ├── services/
│   │   └── api.js         # Frontend API client
│   └── App.jsx            # Main React component
├── .env                   # Frontend environment
└── package.json
```

## Notes

- The database file (`setiakawan.db`) is created automatically in the `backend` folder
- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens expire after 7 days
- CORS is enabled for all origins (configure for production)
- Admin endpoints require JWT token with `role: 'admin'`

## API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

### Authentication Response
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "member",
    "membership": "Gold"
  }
}
```

## Troubleshooting

### Database Issues
If you encounter database errors, try deleting the `backend/setiakawan.db` file and restart the server.

### Port Already in Use
Change the `PORT` value in the `.env` file if port 5000 is already in use.

### CORS Errors
Ensure the frontend is configured to use the correct API URL in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
