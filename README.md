# Sriram IAS Backend - RBAC System

A complete Role-Based Access Control (RBAC) backend system built with Node.js, Express, and MongoDB for Sriram IAS coaching institute.

## 🚀 Features

- **Multi-Role Authentication**: Super Admin, Center Admin, Employee, Student, Parent
- **JWT-based Authentication**: Secure token-based authentication
- **OTP Login**: For students and parents (passwordless)
- **Email/Password Login**: For admins and employees
- **Role-Based Access Control**: Granular permission management
- **Location-Based Access**: Center-specific data isolation
- **Rate Limiting**: Protection against abuse
- **Security Headers**: Helmet.js for enhanced security
- **CORS Enabled**: Cross-origin resource sharing support

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sriram-ias-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # IMPORTANT: Replace YOUR_PASSWORD with your actual MongoDB password
   MONGO_URI=mongodb+srv://tdeekshith46_db_user:YOUR_PASSWORD@cluster.trnd9mh.mongodb.net/sriramIAS
   
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   
   SUPER_ADMIN_EMAIL=admin@sriram.com
   SUPER_ADMIN_PASSWORD=admin123
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
sriram-ias-backend/
│
├── config/
│   └── db.js                 # Database connection
│
├── models/
│   ├── User.js              # User model (all roles)
│   ├── Student.js           # Student profile
│   ├── Parent.js            # Parent profile
│   ├── Employee.js          # Employee profile
│   ├── Center.js            # Center information
│   └── OTP.js               # OTP storage
│
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── adminController.js   # Admin operations
│   └── userController.js    # User profile operations
│
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   └── roleMiddleware.js    # Role-based access control
│
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── adminRoutes.js       # Admin endpoints
│   └── userRoutes.js        # User endpoints
│
├── utils/
│   ├── otpService.js        # OTP generation & verification
│   └── generateToken.js     # JWT token generation
│
├── app.js                   # Express app setup
├── server.js                # Server entry point
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
└── package.json            # Dependencies & scripts
```

## 🔐 Roles & Permissions

| Role | Created By | Login Method | Access Level |
|------|-----------|--------------|--------------|
| **Super Admin** | Default (env vars) | Email + Password | Full system access |
| **Center Admin** | Super Admin | Email + Password | Location-specific management |
| **Employee** | Center Admin | Email + Password | Limited permissions |
| **Student** | Self-signup | OTP (mobile/email) | Personal data only |
| **Parent** | Linked to Student | OTP (mobile/email) | View student data |

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

```
POST /api/auth/login-super-admin      # Super Admin login
POST /api/auth/login                  # Center Admin & Employee login
POST /api/auth/send-otp               # Send OTP (Students/Parents)
POST /api/auth/verify-otp             # Verify OTP & login
POST /api/auth/student-signup         # Student registration
POST /api/auth/parent-login-request   # Parent login request
```

### Admin Routes (`/api/admin`)

```
POST /api/admin/create-center-admin   # Create center admin (Super Admin only)
POST /api/admin/create-employee       # Create employee (Super/Center Admin)
GET  /api/admin/users                 # Get users (filtered by role/location)
PUT  /api/admin/user/:id/status       # Activate/Deactivate user
GET  /api/admin/centers               # Get all centers (Super Admin only)
```

### User Routes (`/api/user`)

```
GET  /api/user/profile                # Get user profile
PUT  /api/user/profile                # Update user profile
PUT  /api/user/change-password        # Change password
```

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Super Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login-super-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sriram.com",
    "password": "admin123"
  }'
```

### 3. Student Signup
```bash
curl -X POST http://localhost:5000/api/auth/student-signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "parentName": "Jane Doe",
    "parentMobile": "9876543211",
    "parentEmail": "jane@example.com"
  }'
```

### 4. Send OTP (for Student/Parent)
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9876543210"
  }'
```

### 5. Verify OTP & Login
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9876543210",
    "otp": "123456"
  }'
```

### 6. Access Protected Route
```bash
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Stateless authentication with expiration
- **OTP Expiry**: 5-minute validity for OTPs
- **Rate Limiting**: Prevents brute force attacks
- **Helmet.js**: Security HTTP headers
- **CORS Protection**: Configurable cross-origin policies
- **Input Validation**: Server-side validation on all endpoints

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment (development/production) | No |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `SUPER_ADMIN_EMAIL` | Super admin email | Yes |
| `SUPER_ADMIN_PASSWORD` | Super admin password | Yes |

## 📝 Important Notes

### MongoDB Setup
1. Replace `YOUR_PASSWORD` in the `.env` file with your actual MongoDB password
2. Ensure your IP is whitelisted in MongoDB Atlas
3. The database `sriramIAS` will be created automatically

### OTP Integration (Production)
Currently, OTPs are logged to the console for development. For production:
- Integrate SMS service (Twilio, MSG91, etc.)
- Integrate Email service (SendGrid, AWS SES, etc.)
- Update `utils/otpService.js` accordingly

### Super Admin Credentials
⚠️ **Change default credentials in production!**
- Update `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` in `.env`

## 🚀 Deployment

### Option 1: Render
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy!

### Option 2: Heroku
```bash
heroku create your-app-name
heroku config:set MONGO_URI=your_mongo_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### Option 3: AWS EC2
1. Launch EC2 instance
2. Install Node.js and MongoDB
3. Clone repository and configure `.env`
4. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "sriram-ias"
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👨‍💻 Support

For issues and questions, please contact the development team.

---

**Built with ❤️ for Sriram IAS**
