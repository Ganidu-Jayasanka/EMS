import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createDepartment, getDepartment, updateDepartment } from "../../api/departmentService";
import { toast } from "react-toastify";
import "./DepartmentForm.css"; // import custom CSS

export default function DepartmentForm() {
  const { id } = useParams();
  const editMode = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({ departmentCode: "", departmentName: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode) {
      setLoading(true);
      getDepartment(id)
        .then(res =>
          setForm({
            departmentCode: res.data.departmentCode,
            departmentName: res.data.departmentName,
          })
        )
        .catch(() => toast.error("❌ Failed to load department"))
        .finally(() => setLoading(false));
    }
  }, [id, editMode]);

 
  const validate = () => {
    const e = {};

  // Department Code: required, must have at least 2 letters + 1 number, only letters/numbers, length >= 2
if (!form.departmentCode.trim()) {
  e.departmentCode = "Department code is required";
} else if (
  !/^(?=(?:.*[A-Za-z]){2,})(?=.*\d)[A-Za-z0-9]+$/.test(form.departmentCode)
) {
  e.departmentCode =
    "Code must contain at least 2 letters and 1 number (letters & digits only)";
} else if (form.departmentCode.length < 2) {
  e.departmentCode = "Code must be at least 2 characters";
}

    // Department Name: required, letters/spaces only, length >= 3
    if (!form.departmentName.trim()) {
      e.departmentName = "Department name is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.departmentName)) {
      e.departmentName = "Name must contain only letters";
    } else if (form.departmentName.length < 2) {
      e.departmentName = "Name must be at least 2 characters";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };


  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      if (editMode) {
        await updateDepartment(id, form);
        toast.success("✅ Department updated successfully!");
      } else {
        await createDepartment(form);
        toast.success("✅ Department created successfully!");
      }
      navigate("/departments");
    } catch (err) {
      toast.error(`❌ Save failed: ${err?.response?.data?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 department-form-wrapper">
      <div className="card department-card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-4">{editMode ? "Edit" : "Add"} Department</h3>

          {loading && (
            <div className="text-center my-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* CODE FIELD */}
            <div className="mb-3">
              <label htmlFor="departmentCode" className="form-label">
                Department Code
              </label>
              <input
                id="departmentCode"
                type="text"
                className={`form-control ${errors.departmentCode ? "is-invalid" : ""}`}
                value={form.departmentCode}
                onChange={e => setForm({ ...form, departmentCode: e.target.value })}
                placeholder="e.g. HR01"
              />
              {errors.departmentCode && <div className="invalid-feedback">{errors.departmentCode}</div>}
            </div>

            {/* NAME FIELD */}
            <div className="mb-3">
              <label htmlFor="departmentName" className="form-label">
                Department Name
              </label>
              <input
                id="departmentName"
                type="text"
                className={`form-control ${errors.departmentName ? "is-invalid" : ""}`}
                value={form.departmentName}
                onChange={e => setForm({ ...form, departmentName: e.target.value })}
                placeholder="e.g. Human Resources"
              />
              {errors.departmentName && <div className="invalid-feedback">{errors.departmentName}</div>}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                )}
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}