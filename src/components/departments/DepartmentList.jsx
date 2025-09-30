import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDepartments, deleteDepartment } from "../../api/departmentService";
import { toast } from "react-toastify";

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);

  // Load departments
  async function load() {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch {
      toast.error("Failed to load departments");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteDepartment(id);
      toast.success("Department deleted successfully!");
      load();
    } catch {
      toast.error("Failed to delete department");
    }
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Departments</h3>
        <Link to="/departments/new" className="btn btn-primary">
          Add Department
        </Link>
      </div>

      <div className="table-responsive shadow-sm">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Created</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map(d => (
                <tr key={d.departmentId}>
                  <td>{d.departmentCode}</td>
                  <td>{d.departmentName}</td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    <Link
                      className="btn btn-sm btn-outline-secondary me-2"
                      to={`/departments/edit/${d.departmentId}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(d.departmentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  No departments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
