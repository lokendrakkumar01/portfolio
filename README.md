# 🚀 Full-Stack Personal Portfolio & CMS

A premium, production-ready, full-stack personal portfolio website with a database-driven REST API backend and a secure admin CMS dashboard.

---

## 🌟 Features

- **Dynamic Public Portfolio**: Zero hardcoded content. All data fetched dynamically from MongoDB via REST API.
- **Full Admin CMS Dashboard**: Manage Profile, Projects, Skills, Certificates, Achievements, Education, Experience, Gallery, Resume/CV, Social Links, Contact Messages, and Site Settings.
- **Authentication**: JWT token-based authentication with HTTP-Only Cookies and Bearer header fallback.
- **Storage Abstraction**: Configurable Cloudinary or local disk file storage provider for images, certificates, and PDF resumes.
- **Theme Support**: Seamless Dark/Light mode with persistence.
- **Responsive & Animated**: Built with Tailwind CSS and Framer Motion.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **TypeScript** + **Express.js**
- **MongoDB Atlas** + **Mongoose**
- **JWT** (`jsonwebtoken`) + `bcryptjs`
- **Zod** validation middleware
- **Helmet**, **CORS**, **Express Rate Limit**, **express-mongo-sanitize**

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Framer Motion**
- **TanStack Query (React Query v5)**
- **Zustand** state management
- **React Hook Form** + **Zod**
- **Axios** with request/response interceptors

---

## 🚀 Local Execution

Both backend and frontend servers are currently **RUNNING LOCALLY**:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

### Admin Credentials
- **URL**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Email**: `admin@portfolio.dev`
- **Password**: `Admin@123`

---

## 💻 Manual Launch Commands

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Seed Database
```bash
cd backend
npm run seed
```
