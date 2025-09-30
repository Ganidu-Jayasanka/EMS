import api from "./api";
export const getDepartments = () => api.get("/departments");
export const getDepartment = (id) => api.get(`/departments/${id}`);
export const createDepartment = (dto) => api.post("/departments", dto);
export const updateDepartment = (id, dto) => api.put(`/departments/${id}`, dto);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);
