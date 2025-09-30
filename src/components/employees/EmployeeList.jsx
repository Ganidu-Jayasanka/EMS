import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../../api/employeeService";
import { toast } from "react-toastify";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  // Load employees
  async function load() {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch {
      toast.error("Failed to load employees");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      toast.success("Employee deleted successfully!");
      load();
    } catch {
      toast.error("Failed to delete employee");
    }
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Employees</h3>
        <Link to="/employees/new" className="btn btn-primary">
          Add Employee
        </Link>
      </div>

      <div className="table-responsive shadow-sm">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Salary</th>
              <th>Department</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map(e => (
                <tr key={e.employeeId}>
                  <td>{e.firstName} {e.lastName}</td>
                  <td>{e.email}</td>
                  <td>{e.age}</td>
                  <td>{e.salary.toLocaleString()}</td>
                  <td>{e.departmentName}</td>
                  <td className="text-end">
                    <Link
                      className="btn btn-sm btn-outline-secondary me-2"
                      to={`/employees/edit/${e.employeeId}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(e.employeeId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
