# Hospital Appointment Backend

A secure, production-ready RESTful API for a hospital appointment system built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization (JWT)
- Role-based access control (User/Admin)
- Appointment management
- Doctor management
- Input validation and error handling
- Security middleware (Helmet, CORS)
- Logging with Morgan
- Environment-based configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Add new doctor (Admin only)
- `DELETE /api/doctors/:id` - Delete doctor (Admin only)

### Appointments
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/appointments` - Get all appointments
- `PUT /api/admin/appointments/:id/status` - Update appointment status
- `GET /api/admin/stats` - Get statistics

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/hospital-appointment
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NODE_ENV=development
   ```

3. Start MongoDB locally or update MONGO_URI for cloud DB.

4. Seed initial data:
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm run dev  # Development with nodemon
   npm start    # Production
   ```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- CORS protection
- Helmet for security headers
- Rate limiting (can be added)
- SQL injection protection via Mongoose

## Production Deployment

- Set NODE_ENV=production
- Use a strong JWT_SECRET
- Configure MongoDB Atlas or similar
- Add rate limiting
- Enable HTTPS
- Use PM2 for process management
