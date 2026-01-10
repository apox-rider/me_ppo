// src/pages/App.jsx  (or src/App.jsx depending on your structure)

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurprisePage from './SuprisePage'; 
import ProtectedRoute from '../components/ProtectedRoute';  // adjust path if needed
import AdminDashboard from './AdminDashboard';
export default function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#0d1d2cff' }}>
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h1>Welcome to Your Secret Diary ✨</h1>
                <p>Go to <strong>/admin</strong> to log in</p>
              </div>
            }
          />

           <Route path="/s/:token" element={<SurprisePage />} />

         <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
/>
        </Routes>
      </div>
    </Router>
  );
}