# Emergency Blood Donation & Transfusion System - Backend

A comprehensive backend system for managing emergency blood donations, built with Node.js, Express, MySQL, and Socket.IO for real-time alerts.

## Features

- **User Management**: Authentication and authorization for donors, hospitals, and blood banks
- **Blood Inventory Management**: Track blood stock levels across different blood banks
- **Emergency Requests**: Hospitals can create urgent blood requests
- **Real-time Alerts**: Socket.IO integration for instant notifications
- **RESTful API**: Complete API endpoints for all operations
- **Role-based Access Control**: Different permissions for different user types

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Password Hashing**: bcryptjs

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=blood_donation_system
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Set up the database:
   - Create a MySQL database
   - Run the SQL schema from `database_schema.sql`

5. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Donors
- `POST /api/donors/register` - Register as donor
- `GET /api/donors/profile` - Get donor profile (authenticated)
- `PUT /api/donors/availability` - Update availability (authenticated)
- `GET /api/donors/requests` - Get available requests (authenticated)

### Hospitals
- `POST /api/hospitals/register` - Register hospital
- `GET /api/hospitals/profile` - Get hospital profile (authenticated)
- `POST /api/hospitals/blood-requests` - Create blood request (authenticated)
- `GET /api/hospitals/blood-requests` - Get hospital requests (authenticated)

### Blood Banks
- `POST /api/blood-banks/register` - Register blood bank
- `GET /api/blood-banks/profile` - Get blood bank profile (authenticated)
- `POST /api/blood-banks/inventory` - Add inventory (authenticated)
- `GET /api/blood-banks/inventory` - Get inventory (authenticated)
- `PUT /api/blood-banks/inventory` - Update inventory (authenticated)
- `GET /api/blood-banks/requests` - Get all requests (authenticated)
- `PUT /api/blood-banks/requests/:requestId/fulfill` - Fulfill request (authenticated)
- `GET /api/blood-banks/alerts/low-stock` - Get low stock alerts (authenticated)

### General
- `GET /api/blood-search?blood_type=A+&location=city` - Search blood availability
- `GET /api/critical-requests` - Get critical requests
- `GET /api/stats` - Get system statistics

## Socket.IO Events

### Client Events
- `join` - Join role-based room
- `new-blood-request` - Trigger new request alert
- `inventory-update` - Trigger inventory alert
- `emergency-alert` - Trigger emergency notification

### Server Events
- `blood-request-alert` - New blood request notification
- `donor-alert` - Alert for compatible donors
- `inventory-alert` - Low stock alert
- `emergency-notification` - Emergency broadcast

## Database Schema

The system uses the following main tables:
- `users` - Base user information
- `donors` - Donor-specific data
- `hospitals` - Hospital information
- `blood_banks` - Blood bank details
- `blood_requests` - Emergency blood requests
- `blood_inventory` - Blood stock tracking

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation and sanitization
- CORS enabled for cross-origin requests

## Real-time Features

- Instant notifications for new blood requests
- Low inventory alerts
- Emergency broadcast system
- Role-based notification rooms

## Testing

Use tools like Postman or Insomnia to test the API endpoints. Sample requests are included in the API documentation above.

## Deployment

The application can be deployed to any Node.js hosting service like Heroku, DigitalOcean, or AWS. Make sure to:
1. Set production environment variables
2. Configure production database
3. Set up proper CORS origins
4. Enable HTTPS in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
