namespace EmployeeManagementSystem.Models
{
    public class Employee
    {

        public int EmployeeId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;

        public string Email {  get; set; } = null!;

        public  DateTime DOB { get; set; }

        public decimal Salary { get; set; }

        public int DepartmentId { get; set; }
    }
}
