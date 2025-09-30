namespace EmployeeManagementSystem.DTOs
{
    public class DepartmentDto
    {

            public int DepartmentId { get; set; }
            public string DepartmentCode { get; set; } = null!;
            public string DepartmentName { get; set; } = null!;
            public DateTime CreatedAt { get; set; }
            public DateTime? UpdatedAt { get; set; }
        

    }
}
