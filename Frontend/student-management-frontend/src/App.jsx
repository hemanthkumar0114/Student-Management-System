import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminUsers from "./pages/AdminUsers";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import StudentDetails from "./pages/StudentDetails";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import CourseDetails from "./pages/CourseDetails";

import "./App.css";

const RootRedirect = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/user-dashboard" replace />;
};

function AppContent() {
  return (
    <div className="ucms-app-layout">
      <Navbar />
      <main className="ucms-main-content">
        <Routes>
          {/* PUBLIC LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* ROOT REDIRECT */}
          <Route path="/" element={<RootRedirect />} />

          {/* DASHBOARDS */}
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN USER MANAGEMENT */}
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          {/* STUDENTS ROUTES */}
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/add"
            element={
              <AdminRoute>
                <AddStudent />
              </AdminRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute>
                <StudentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/edit/:id"
            element={
              <AdminRoute>
                <EditStudent />
              </AdminRoute>
            }
          />

          {/* COURSES ROUTES */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/add"
            element={
              <AdminRoute>
                <AddCourse />
              </AdminRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/edit/:id"
            element={
              <AdminRoute>
                <EditCourse />
              </AdminRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </main>
      <footer className="ucms-footer">
        <div className="ucms-container footer-content">
          <div>
            <strong>Student Management System (UCMS)</strong>
            <p className="text-xs text-slate-400 mt-0.5">Academic Records, Enrollment, and Authentication Registry Portal</p>
          </div>
          <div className="text-xs text-slate-400">
            Spring Boot Security + React &bull; MySQL Database &bull; JWT Authentication
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;