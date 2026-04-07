# Sriram IAS Backend - API Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔑 AUTHENTICATION ENDPOINTS

### 1. Super Admin Login
**POST** `/auth/login-super-admin`

**Body:**
```json
{
  "email": "admin@sriram.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": "Super Admin",
    "email": "admin@sriram.com",
    "role": "super_admin"
  }
}
```

---

### 2. Center Admin / Employee Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "admin@hyderabad.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12346",
    "name": "Center Admin",
    "email": "admin@hyderabad.com",
    "role": "center_admin",
    "location": "Hyderabad"
  }
}
```

---

### 3. Student Signup
**POST** `/auth/student-signup`

**Body:**
```json
{
  "name": "Rahul Sharma",
  "mobile": "9876543210",
  "email": "rahul@example.com",
  "parentName": "Suresh Sharma",
  "parentMobile": "9876543211",
  "parentEmail": "suresh@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "user": {
    "id": "65f1234567890abcdef12347",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "mobile": "9876543210",
    "role": "student"
  }
}
```

---

### 4. Send OTP
**POST** `/auth/send-otp`

**Body:**
```json
{
  "mobile": "9876543210"
}
```
OR
```json
{
  "email": "rahul@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

*Note: Check server console for OTP in development mode*

---

### 5. Verify OTP & Login
**POST** `/auth/verify-otp`

**Body:**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12347",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "mobile": "9876543210",
    "role": "student"
  }
}
```

---

### 6. Parent Login Request
**POST** `/auth/parent-login-request`

**Body:**
```json
{
  "studentName": "Rahul Sharma",
  "mobile": "9876543211"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to parent's registered contact"
}
```

---

## 👨‍💼 ADMIN ENDPOINTS

*All admin endpoints require authentication*

### 1. Create Center Admin
**POST** `/admin/create-center-admin`

**Headers:**
```
Authorization: Bearer <super_admin_token>
```

**Body:**
```json
{
  "name": "Hyderabad Admin",
  "email": "admin@hyderabad.com",
  "password": "password123",
  "location": "Hyderabad"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Center admin created successfully",
  "user": {
    "id": "65f1234567890abcdef12348",
    "name": "Hyderabad Admin",
    "email": "admin@hyderabad.com",
    "role": "center_admin",
    "location": "Hyderabad"
  }
}
```

---

### 2. Create Employee
**POST** `/admin/create-employee`

**Headers:**
```
Authorization: Bearer <center_admin_token>
```

**Body:**
```json
{
  "name": "John Teacher",
  "email": "john@sriram.com",
  "password": "password123",
  "permissions": ["view_students", "update_attendance"],
  "center": "Hyderabad"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "user": {
    "id": "65f1234567890abcdef12349",
    "name": "John Teacher",
    "email": "john@sriram.com",
    "role": "employee",
    "location": "Hyderabad",
    "permissions": ["view_students", "update_attendance"]
  }
}
```

---

### 3. Get Users
**GET** `/admin/users?role=student&location=Hyderabad&page=1&limit=10`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `role` (optional): Filter by role (student, parent, employee, etc.)
- `location` (optional): Filter by location (Super Admin only)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "users": [
    {
      "id": "65f1234567890abcdef12347",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "mobile": "9876543210",
      "role": "student",
      "location": "Hyderabad",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 4. Update User Status
**PUT** `/admin/user/:id/status`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "user": {
    "id": "65f1234567890abcdef12347",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "isActive": false
  }
}
```

---

### 5. Get Centers
**GET** `/admin/centers`

**Headers:**
```
Authorization: Bearer <super_admin_token>
```

**Response:**
```json
{
  "success": true,
  "centers": [
    {
      "id": "65f1234567890abcdef12350",
      "location": "Hyderabad",
      "adminId": {
        "id": "65f1234567890abcdef12348",
        "name": "Hyderabad Admin",
        "email": "admin@hyderabad.com"
      },
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## 👤 USER ENDPOINTS

*All user endpoints require authentication*

### 1. Get Profile
**GET** `/user/profile`

**Headers:**
```
Authorization: Bearer <user_token>
```

**Response (Student):**
```json
{
  "success": true,
  "user": {
    "id": "65f1234567890abcdef12347",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "mobile": "9876543210",
    "role": "student",
    "location": "Hyderabad",
    "isActive": true,
    "student": {
      "userId": "65f1234567890abcdef12347",
      "parentName": "Suresh Sharma",
      "parentMobile": "9876543211",
      "parentEmail": "suresh@example.com"
    }
  }
}
```

---

### 2. Update Profile
**PUT** `/user/profile`

**Headers:**
```
Authorization: Bearer <user_token>
```

**Body:**
```json
{
  "name": "Rahul Kumar Sharma",
  "mobile": "9876543299"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "65f1234567890abcdef12347",
    "name": "Rahul Kumar Sharma",
    "email": "rahul@example.com",
    "mobile": "9876543299"
  }
}
```

---

### 3. Change Password
**PUT** `/user/change-password`

**Headers:**
```
Authorization: Bearer <user_token>
```

**Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

*Note: This endpoint only works for users with password-based login (admins and employees)*

---

## ⚠️ ERROR RESPONSES

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Insufficient permissions.",
  "required": ["super_admin"],
  "current": "employee"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many OTP requests, please try again later"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details here"
}
```

---

## 📝 COMMON USE CASES

### Complete Student Flow
1. **Signup**: `POST /auth/student-signup`
2. **Request OTP**: `POST /auth/send-otp`
3. **Verify OTP & Login**: `POST /auth/verify-otp`
4. **Get Profile**: `GET /user/profile` (with token)

### Complete Admin Flow
1. **Super Admin Login**: `POST /auth/login-super-admin`
2. **Create Center Admin**: `POST /admin/create-center-admin`
3. **Login as Center Admin**: `POST /auth/login`
4. **Create Employee**: `POST /admin/create-employee`
5. **View Students**: `GET /admin/users?role=student`

---

## 🔧 TESTING WITH CURL

### Example: Complete Student Registration & Login

```bash
# Step 1: Register student
curl -X POST http://localhost:5000/api/auth/student-signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "mobile": "9999999999",
    "email": "test@student.com",
    "parentName": "Test Parent",
    "parentMobile": "8888888888",
    "parentEmail": "test@parent.com"
  }'

# Step 2: Request OTP (check console for OTP)
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "9999999999"}'

# Step 3: Verify OTP (replace 123456 with actual OTP from console)
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9999999999",
    "otp": "123456"
  }'

# Step 4: Use token to get profile
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**For more detailed documentation, see README.md**
