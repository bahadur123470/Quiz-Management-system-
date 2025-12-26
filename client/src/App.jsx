import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <AnimatedRoutes />
      </Router>
    </>
  );
}

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Protected routes */}
        <Route
          path="/instructor/*"
          element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <PageTransition><InstructorDashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <PageTransition><StudentDashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default App;
