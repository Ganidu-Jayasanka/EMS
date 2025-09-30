using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystem.DTOs
{
    public class UpdateDepartmentDto
    {

        [Required, StringLength(20)]
        public string DepartmentCode { get; set; } = null!;

        [Required, StringLength(100)]
        public string DepartmentName { get; set; } = null!;
    }
}
