# 💬 ChitChat Application

ChitChat is a premium, real-time collaboration environment featuring room-based communication, end-to-end encrypted messaging, and a modern, responsive layout. It is built as a monorepo consisting of a Spring Boot backend and a React + Vite frontend.

---

## ✨ Features

- **⚡ Sub-millisecond Message Delivery**: Instant real-time messaging powered by Spring Boot WebSockets (SockJS + STOMP).
- **🔒 End-to-End Encryption (E2EE)**: Complete encryption of all chat histories to ensure private, secure communications.
- **🎨 Premium Visual Experience**: Stunning glassmorphic cards, dark/light theme switching, custom micro-animations, and a cohesive pink-to-purple branding.
- **🛡️ Secure JWT Authentication**: Full session security powered by Spring Security and JSON Web Tokens.
- **🚪 Room Management**: Easily create custom rooms, share invite codes, and join workspaces instantly.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: TailwindCSS & Custom HSL CSS Variables
- **Icons**: Lucide React
- **WebSocket Client**: `@stomp/stompjs` & `sockjs-client`

### Backend
- **Framework**: Spring Boot 3.5.4
- **Security**: Spring Security & JWT
- **Real-Time API**: Spring WebSockets (STOMP protocol)
- **Database ORM**: Spring Data JPA / Hibernate
- **Database**: PostgreSQL (hosted on [Supabase](https://supabase.com))

---

## 🚀 Running Locally

### Prerequisites
- **Java JDK**: version 21+
- **Node.js**: version 20+
- **Supabase Account**: Create a free project at [supabase.com](https://supabase.com)

### 1. Set Up Environment Variables
Copy the example env file and fill in your Supabase credentials:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your values:
```env
SPRING_DATASOURCE_USERNAME=postgres.your-project-ref
SPRING_DATASOURCE_PASSWORD=your_supabase_password
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require
JWT_SECRET=your_base64_encoded_jwt_secret
```

> 💡 You can find your connection details in **Supabase Dashboard → Settings → Database → Connection Pooling**.

### 2. Secure Supabase Tables (Required)
By default, Supabase exposes tables in the `public` schema via HTTP REST API. Since this project uses a custom Spring Boot API backend, enable Row Level Security (RLS) to block unauthorized HTTP access:
1. Open your **Supabase Dashboard** → **SQL Editor**.
2. Run the SQL script found in [`backend/src/main/resources/supabase-security-fix.sql`](file:///c:/Users/ASUS/Desktop/real_time_chatApp_frontend/backend/src/main/resources/supabase-security-fix.sql).

### 3. Run the Backend
```bash
cd backend
./mvnw spring-boot:run
```
*The backend will boot up at `http://localhost:8080` and automatically create the required database tables via Hibernate.*

### 4. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run at `http://localhost:5173`.*

---

## ☁️ Deployment

This project is configured to be fully **deploy-ready** on platforms like **Render** by parsing production configurations dynamically from environment variables.

### Environment Variables

#### Backend (Render Web Service using Docker)
| Variable | Description | Example |
|---|---|---|
| `SPRING_DATASOURCE_URL` | Supabase PostgreSQL pooler JDBC URL | `jdbc:postgresql://aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Supabase pooler username | `postgres.your-project-ref` |
| `SPRING_DATASOURCE_PASSWORD` | Your Supabase database password | |
| `JWT_SECRET` | A base64-encoded 256-bit secret key for JWT | |
| `ALLOWED_ORIGINS` | Your deployed frontend URL | `https://chichat.onrender.com` |
| `PORT` | Set automatically by Render | |

#### Frontend (Render Static Site)
| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Your deployed backend URL | `https://chichat-backend.onrender.com` |
