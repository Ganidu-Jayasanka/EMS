

namespace EmployeeManagementSystem.Models
{
    public class Department
    {
   
            public int DepartmentId { get; set; }
            public string DepartmentCode { get; set; } = null!;
        public string DepartmentName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

            public DateTime UpdateAt { get; set; }
        

    }
}
