import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatRoom from './pages/ChatRoom';
import NotFound from './pages/NotFound';
import JoinRoom from './pages/JoinRoom';

/**
 * Main Application routing wrapper and global component setup.
 */
function App() {
  return (
    <Router>
      {/* Premium dark-themed Toast Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-panel !bg-slate-900/90 !text-slate-100 !border-white/5 !shadow-2xl rounded-xl text-sm font-medium',
          duration: 4000,
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#f1f5f9',
          },
          success: {
            iconTheme: {
              primary: '#10b981', // Emerald success icon
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // Red danger icon
              secondary: '#ffffff',
            },
          },
        }}
      />

      <Routes>
        {/* Guest Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Public Invitation Route */}
        <Route path="/join/:roomCode" element={<JoinRoom />} />

        {/* Protected App Routes */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/room/:roomCode" element={<ChatRoom />} />
        </Route>

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 Catch-All Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
