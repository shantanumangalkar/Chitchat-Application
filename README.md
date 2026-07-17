# 💬 ChiChat Application

ChiChat is a premium, real-time collaboration environment featuring room-based communication, end-to-end encrypted messaging, and a modern, responsive layout. It is built as a monorepo consisting of a Spring Boot backend and a React + Vite frontend.

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
- **Database**: MySQL (e.g. hosted on TiDB Cloud Serverless)

---

## 🚀 Running Locally

### Prerequisites
- **Java JDK**: version 21+
- **Node.js**: version 20+
- **MySQL Server**: running locally

### 1. Set Up the Database
Create a MySQL database named `chatapp`:
```sql
CREATE DATABASE chatapp;
```

### 2. Run the Backend
Navigate to the `backend` folder and run the Maven wrapper command:
```bash
cd backend
./mvnw spring-boot:run
```
*The backend will boot up at `http://localhost:8080` and automatically create the required database tables.*

### 3. Run the Frontend
Navigate to the `frontend` folder, install the packages, and start Vite:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run at `http://localhost:5173`.*

---

## ☁️ Deployment

This project is configured to be fully **deploy-ready** on platforms like **Render** by parsing production configurations dynamically from environment variables.

### Environment Variables List
To configure your production services, add these variables in your deployment dashboard:

#### Backend (Render Web Service using Docker)
* **`SPRING_DATASOURCE_URL`**: `jdbc:mysql://<host>:<port>/<db_name>?sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3`
* **`SPRING_DATASOURCE_USERNAME`**: Your TiDB Cloud username (e.g. `<prefix>.root`)
* **`SPRING_DATASOURCE_PASSWORD`**: Your database password
* **`JWT_SECRET`**: A custom 256-bit secret key for JWT session validation
* **`ALLOWED_ORIGINS`**: The URL of your deployed frontend (e.g. `https://chichat.onrender.com`)
* **`PORT`**: Set automatically by Render (maps to Spring Boot host port)

#### Frontend (Render Static Site)
* **`VITE_API_BASE_URL`**: The live URL of your deployed backend service (e.g. `https://chichat-backend.onrender.com`)
