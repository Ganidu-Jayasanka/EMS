import api from "./api";
export const getEmployees = () => api.get("/employees");
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const createEmployee = (dto) => api.post("/employees", dto);
export const updateEmployee = (id, dto) => api.put(`/employees/${id}`, dto);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
