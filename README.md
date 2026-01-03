# Dayflow - Human Resource Management System

<div align="center">
  <h3>🚀 Modern HRMS Solution for Streamlined Workforce Management</h3>
  <p>A full-stack Human Resource Management System built with React, Node.js, Express, and MySQL</p>
</div>

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About the Project

**Dayflow** is a comprehensive Human Resource Management System designed to simplify and automate HR operations for modern organizations. The platform enables companies to manage employees, track attendance, handle time-off requests, and maintain detailed employee profiles—all from a centralized dashboard.

### What Does Dayflow Do?

- **Employee Management**: Add, update, and manage employee records with role-based access control (Admin, HR, Employee)
- **Attendance Tracking**: Real-time check-in/check-out system with automated timestamp recording
- **Time-Off Management**: Submit, approve, and track leave requests
- **Profile Management**: Comprehensive employee profiles with company details
- **Authentication & Authorization**: Secure JWT-based authentication with bcrypt password hashing
- **Role-Based Access**: Different views and permissions for Admin, HR, and Employee roles

---

## ✨ Features

- ✅ **Secure Authentication** - JWT-based login/signup with encrypted passwords
- ✅ **Real-Time Attendance** - Check-in/check-out with server-side timestamp validation
- ✅ **Role-Based Dashboard** - Customized views for Admin, HR, and Employees
- ✅ **Employee Directory** - Search and view all team members
- ✅ **Responsive Design** - Beautiful UI built with shadcn/ui and Tailwind CSS
- ✅ **RESTful API** - Clean, documented backend endpoints
- ✅ **Database Relationships** - Foreign key constraints and indexed queries for performance

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Fast, minimalist web framework
- **MySQL** - Relational database
- **mysql2** - MySQL client with promise support
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management
- **CORS** - Cross-Origin Resource Sharing

---

## 📁 Project Structure

```
Dayflow-Human-Resource-Management-System/
│
├── backend/                    # Backend Node.js application
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── auth.controller.js        # Auth logic
│   │   │   └── attendance.controller.js  # Attendance logic
│   │   ├── models/
│   │   │   ├── user.model.js             # User queries
│   │   │   └── attendance.model.js       # Attendance queries
│   │   ├── routes/
│   │   │   ├── auth.routes.js            # Auth endpoints
│   │   │   └── attendance.routes.js      # Attendance endpoints
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js        # JWT verification
│   │   └── app.js             # Express app configuration
│   ├── migrations/            # SQL migration files
│   ├── server.js              # Server entry point
│   ├── package.json
│   └── .env                   # Environment variables
│
├── src/                       # Frontend React application
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # shadcn/ui components
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom hooks
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   └── utils.ts           # Utility functions
│   ├── pages/                 # Page components
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Attendance.tsx
│   │   └── ...
│   ├── App.tsx
│   └── main.tsx
│
├── public/                    # Static assets
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind configuration
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/dayflow-hrms.git
cd dayflow-hrms
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Install backend dependencies**

```bash
cd backend
npm install
cd ..
```

---

## 🗄️ Database Setup

### 1. Create MySQL Database

Open your MySQL client or terminal and run:

```sql
CREATE DATABASE dayflow_hrms;
USE dayflow_hrms;
```

### 2. Run Migrations

Execute the SQL migration files in order:

**Migration 1: Create Users Table**

```sql
-- backend/migrations/001_create_users.sql

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(191),
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(50),
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','HR','EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
  login_id VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Migration 2: Create Attendance Table**

```sql
-- backend/migrations/002_create_attendance.sql

CREATE TABLE IF NOT EXISTS attendance (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  check_in DATETIME NULL,
  check_out DATETIME NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Run via MySQL CLI:**

```bash
mysql -u your_username -p dayflow_hrms < backend/migrations/001_create_users.sql
mysql -u your_username -p dayflow_hrms < backend/migrations/002_create_attendance.sql
```

---

## ⚙️ Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=4000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=dayflow_hrms
DB_CONNECTION_LIMIT=10

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=8h

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10
```

**⚠️ Security Note:** Never commit your `.env` file to version control. Replace placeholder values with your actual credentials.

### Frontend Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:4000
```

---

## 🎮 Running the Application

### Development Mode

Open two terminal windows:

**Terminal 1: Start Backend Server**

```bash
cd backend
npm run dev
# Server will start on http://localhost:4000
```

**Terminal 2: Start Frontend Dev Server**

```bash
npm run dev
# Frontend will start on http://localhost:5173
```

### Production Mode

**Build Frontend:**

```bash
npm run build
```

**Start Backend:**

```bash
cd backend
npm start
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register Admin
```http
POST /api/auth/register
Content-Type: application/json

{
  "company_name": "TechCorp",
  "name": "John Doe",
  "email": "john@techcorp.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "login_id": "JOHN001"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@techcorp.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@techcorp.com",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "8h"
  }
}
```

### Attendance Endpoints (Protected)

#### Check In
```http
POST /api/attendance/checkin
Authorization: Bearer <your_jwt_token>
```

#### Check Out
```http
POST /api/attendance/checkout
Authorization: Bearer <your_jwt_token>
```

#### Get Today's Attendance
```http
GET /api/attendance/today
Authorization: Bearer <your_jwt_token>
```

---

## 🖼️ Screenshots

_Add screenshots of your application here_

---

## 📝 Development Workflow

1. **Branch Strategy**: Create feature branches from `main`
2. **Commit Messages**: Use conventional commits (e.g., `feat:`, `fix:`, `docs:`)
3. **Testing**: Test all endpoints before committing
4. **Code Review**: Submit pull requests for review

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🔒 Security

- Passwords are hashed using bcrypt with configurable salt rounds
- JWT tokens expire after 8 hours (configurable)
- SQL injection protection via parameterized queries
- CORS enabled with configurable origins
- Environment variables for sensitive data

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - [GitHub Profile](https://github.com/your-username)

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vite](https://vitejs.dev/) for the blazing-fast build tool
- [Express.js](https://expressjs.com/) for the robust backend framework

---

<div align="center">
  <p>Made with ❤️ by the Dayflow Team</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>