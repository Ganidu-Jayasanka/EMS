using EmployeeManagementSystem.DTOs;

namespace EmployeeManagementSystem.Repositories
{
    public interface IDepartmentRepository
    {
        Task<IEnumerable<DepartmentDto>> GetAllAsync();
        Task<DepartmentDto?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateDepartmentDto dto);
        Task<bool> UpdateAsync(int id, UpdateDepartmentDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
