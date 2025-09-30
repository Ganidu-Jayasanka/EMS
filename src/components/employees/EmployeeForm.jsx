import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createEmployee, getEmployee, updateEmployee } from "../../api/employeeService";
import { getDepartments } from "../../api/departmentService";
import "./EmployeeForm.css";

function computeAge(dob) {
  if (!dob) return 0;
  const b = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
}

export default function EmployeeForm() {
  const { id } = useParams();
  const editMode = !!id;
  const navigate = useNavigate();
  
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", dob: "", salary: "", departmentId: ""
  });
  const [age, setAge] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDepartments()
      .then(r => setDepartments(r.data))
      .catch(() => toast.error("❌ Failed to load departments"));
  }, []);

  useEffect(() => {
    if (editMode) {
      setLoading(true);
      getEmployee(id)
        .then(r => {
          const d = r.data;
          setForm({ 
            firstName: d.firstName,
            lastName: d.lastName,
            email: d.email,
            dob: d.dob.substring(0,10),
            salary: d.salary,
            departmentId: d.departmentId
          });
          setAge(d.age || computeAge(d.dob));
        })
        .catch(() => toast.error("❌ Failed to load employee"))
        .finally(() => setLoading(false));
    }
  }, [id, editMode]);


  function validate() {
    const e = {};

    // First Name
    if (!form.firstName) e.firstName = "First name is required";
    else if (!/^[A-Za-z\s]+$/.test(form.firstName)) e.firstName = "Only letters allowed";
    else if (form.firstName.length < 2) e.firstName = "Must be at least 2 letters";

    // Last Name
    if (!form.lastName) e.lastName = "Last name is required";
    else if (!/^[A-Za-z\s]+$/.test(form.lastName)) e.lastName = "Only letters allowed";
    else if (form.lastName.length < 2) e.lastName = "Must be at least 2 letters";

    // Email
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";

    // DOB
    if (!form.dob) e.dob = "Date of birth is required";
    else if (new Date(form.dob) > new Date()) e.dob = "DOB cannot be in the future";

    // Salary
    if (form.salary === "" || form.salary === null) e.salary = "Salary is required";
    else if (isNaN(form.salary)) e.salary = "Salary must be a number";
    else if (Number(form.salary) < 0) e.salary = "Salary must be positive";

    // Department
    if (!form.departmentId) e.departmentId = "Department is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onDobChange(val) {
    setForm({...form, dob: val});
    setAge(computeAge(val));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      dob: form.dob,
      salary: parseFloat(form.salary),
      departmentId: parseInt(form.departmentId)
    };

    try {
      setLoading(true);
      if (editMode) {
        await updateEmployee(id, payload);
        toast.success("✅ Employee updated successfully!");
      } else {
        await createEmployee(payload);
        toast.success("✅ Employee created successfully!");
      }
      navigate("/employees");
    } catch (err) {
      toast.error(`❌ Save failed: ${err?.response?.data?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

  return (
    <div>
      <h3>{editMode ? "Edit" : "Add"} Employee</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>First Name</label>
            <input
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              value={form.firstName}
              onChange={e => setForm({...form, firstName: e.target.value})}
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label>Last Name</label>
            <input
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              value={form.lastName}
              onChange={e => setForm({...form, lastName: e.target.value})}
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>DOB</label>
            <input
              type="date"
              className={`form-control ${errors.dob ? "is-invalid" : ""}`}
              value={form.dob}
              onChange={e => onDobChange(e.target.value)}
            />
            {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
          </div>
          <div className="col-md-2 mb-3">
            <label>Age</label>
            <input readOnly className="form-control" value={age} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Salary</label>
            <input
              type="number"
              className={`form-control ${errors.salary ? "is-invalid" : ""}`}
              value={form.salary}
              onChange={e => setForm({...form, salary: e.target.value})}
            />
            {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label>Department</label>
          <select
            className={`form-control ${errors.departmentId ? "is-invalid" : ""}`}
            value={form.departmentId}
            onChange={e => setForm({...form, departmentId: e.target.value})}
          >
            <option value="">Select</option>
            {departments.map(d => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.departmentName}
              </option>
            ))}
          </select>
          {errors.departmentId && <div className="invalid-feedback">{errors.departmentId}</div>}
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
          Save
        </button>
      </form>
    </div>
  );
}