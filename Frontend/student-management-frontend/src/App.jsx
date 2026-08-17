import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import StudentDetails from "./pages/StudentDetails";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import CourseDetails from "./pages/CourseDetails";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="ucms-app-layout">
        <Navbar />
        <main className="ucms-main-content">
          <Routes>
            {/* DASHBOARD */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* STUDENTS ROUTES */}
            <Route path="/students" element={<Students />} />
            <Route path="/students/add" element={<AddStudent />} />
            <Route path="/students/:id" element={<StudentDetails />} />
            <Route path="/students/edit/:id" element={<EditStudent />} />

            {/* COURSES ROUTES */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/add" element={<AddCourse />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/courses/edit/:id" element={<EditCourse />} />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="ucms-footer">
          <div className="ucms-container footer-content">
            <div>
              <strong>University Campus Management System (UCMS)</strong>
              <p className="text-xs text-slate-400 mt-0.5">Academic Records, Enrollment, and Curriculum Administration Portal</p>
            </div>
            <div className="text-xs text-slate-400">
              Spring Boot + React Architecture &bull; H2 / MySQL Database &bull; Port 8080 / 5173
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;