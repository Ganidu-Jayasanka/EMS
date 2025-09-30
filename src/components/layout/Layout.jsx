import React from "react";
import { NavLink } from "react-router-dom";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="app-icon">🏠</span>
          <span className="brand">EMS</span>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/departments" className="nav-link">
                🏢 Departments
              </NavLink>
            </li>
            <li>
              <NavLink to="/employees" className="nav-link">
                👔 Employees
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main area */}
      <div className="main">
        {/* Header */}
        <header className="topbar">
          <h2> Employee Management System</h2>
          <div className="topbar-right">
            <span>Hello, Admin</span>
            <button className="logout">❌ Logout</button>
          </div>
        </header>

        {/* Page content */}
        <div className="content">{children}</div>
      </div>
    </div>
  );
}