using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystem.DTOs
{
    public class UpdateEmployeeDto
    {
        [Required, StringLength(100)]
        public string FirstName { get; set; } = null!;

        [Required, StringLength(100)]
        public string LastName { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public DateTime DOB { get; set; }

        [Required, Range(0, double.MaxValue)]
        public decimal Salary { get; set; }

        [Required]
        public int DepartmentId { get; set; }
    }
}
