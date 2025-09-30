using EmployeeManagementSystem.DTOs;
using System.Data.SqlClient;
using System.Data;


namespace EmployeeManagementSystem.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly string _conn;
        public EmployeeRepository(string connectionString) => _conn = connectionString;

        private int CalculateAge(DateTime dob)
        {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;
            if (dob.Date > today.AddYears(-age)) age--;
            return age;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
        {
            var list = new List<EmployeeDto>();
            using var conn = new SqlConnection(_conn);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT e.EmployeeId, e.FirstName, e.LastName, e.Email, e.DOB, e.Salary, e.DepartmentId, d.DepartmentName
                            FROM Employees e
                            LEFT JOIN Departments d ON e.DepartmentId = d.DepartmentId
                            ORDER BY e.LastName, e.FirstName";
            using var rdr = await cmd.ExecuteReaderAsync();
            while (await rdr.ReadAsync())
            {
                var dob = rdr.GetDateTime(4);
                list.Add(new EmployeeDto
                {
                    EmployeeId = rdr.GetInt32(0),
                    FirstName = rdr.GetString(1),
                    LastName = rdr.GetString(2),
                    Email = rdr.GetString(3),
                    DOB = dob,
                    Age = CalculateAge(dob),
                    Salary = rdr.GetDecimal(5),
                    DepartmentId = rdr.GetInt32(6),
                    DepartmentName = rdr.IsDBNull(7) ? null : rdr.GetString(7)
                });
            }
            return list;
        }

        public async Task<EmployeeDto?> GetByIdAsync(int id)
        {
            using var conn = new SqlConnection(_conn);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT e.EmployeeId, e.FirstName, e.LastName, e.Email, e.DOB, e.Salary, e.DepartmentId, d.DepartmentName
                            FROM Employees e
                            LEFT JOIN Departments d ON e.DepartmentId = d.DepartmentId
                            WHERE e.EmployeeId=@id";
            cmd.Parameters.AddWithValue("@id", id);
            using var rdr = await cmd.ExecuteReaderAsync();
            if (await rdr.ReadAsync())
            {
                var dob = rdr.GetDateTime(4);
                return new EmployeeDto
                {
                    EmployeeId = rdr.GetInt32(0),
                    FirstName = rdr.GetString(1),
                    LastName = rdr.GetString(2),
                    Email = rdr.GetString(3),
                    DOB = dob,
                    Age = CalculateAge(dob),
                    Salary = rdr.GetDecimal(5),
                    DepartmentId = rdr.GetInt32(6),
                    DepartmentName = rdr.IsDBNull(7) ? null : rdr.GetString(7)
                };
            }
            return null;
        }

        public async Task<int> CreateAsync(CreateEmployeeDto dto)
        {
            using var conn = new SqlConnection(_conn);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO Employees (FirstName, LastName, Email, DOB, Salary, DepartmentId)
                            VALUES (@fn, @ln, @email, @dob, @salary, @dept);
                            SELECT CAST(SCOPE_IDENTITY() AS int)";
            cmd.Parameters.AddWithValue("@fn", dto.FirstName);
            cmd.Parameters.AddWithValue("@ln", dto.LastName);
            cmd.Parameters.AddWithValue("@email", dto.Email);
            cmd.Parameters.AddWithValue("@dob", dto.DOB);
            cmd.Parameters.AddWithValue("@salary", dto.Salary);
            cmd.Parameters.AddWithValue("@dept", dto.DepartmentId);
            var id = (int)await cmd.ExecuteScalarAsync();
            return id;
        }

        public async Task<bool> UpdateAsync(int id, UpdateEmployeeDto dto)
        {
            using var conn = new SqlConnection(_conn);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"UPDATE Employees
                            SET FirstName=@fn, LastName=@ln, Email=@email, DOB=@dob, Salary=@salary, DepartmentId=@dept
                            WHERE EmployeeId=@id";
            cmd.Parameters.AddWithValue("@fn", dto.FirstName);
            cmd.Parameters.AddWithValue("@ln", dto.LastName);
            cmd.Parameters.AddWithValue("@email", dto.Email);
            cmd.Parameters.AddWithValue("@dob", dto.DOB);
            cmd.Parameters.AddWithValue("@salary", dto.Salary);
            cmd.Parameters.AddWithValue("@dept", dto.DepartmentId);
            cmd.Parameters.AddWithValue("@id", id);
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqlConnection(_conn);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM Employees WHERE EmployeeId=@id";
            cmd.Parameters.AddWithValue("@id", id);
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }
    }
}
