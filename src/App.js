import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";  
import DepartmentList from "./components/departments/DepartmentList";
import DepartmentForm from "./components/departments/DepartmentForm";
import EmployeeList from "./components/employees/EmployeeList";
import EmployeeForm from "./components/employees/EmployeeForm";
import "./App.css"; 

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Redirect root to departments */}
          <Route path="/" element={<Navigate to="/departments" replace />} />

          {/* Department routes */}
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/departments/new" element={<DepartmentForm />} />
          <Route path="/departments/edit/:id" element={<DepartmentForm />} />

          {/* Employee routes */}
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/new" element={<EmployeeForm />} />
          <Route path="/employees/edit/:id" element={<EmployeeForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}