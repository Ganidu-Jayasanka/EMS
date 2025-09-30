using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Models;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;


namespace EmployeeManagementSystem.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly string _conn;
        public DepartmentRepository(string connectionString) => _conn = connectionString;

        public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
        {
            var list = new List<DepartmentDto>();
            using var conn = new SqlConnection(_conn);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT DepartmentId, DepartmentCode, DepartmentName, CreatedAt, UpdatedAt FROM Departments ORDER BY DepartmentName";
            using var rdr = await cmd.ExecuteReaderAsync();
            while (await rdr.ReadAsync())
            {
                list.Add(new DepartmentDto
                {
                    DepartmentId = rdr.GetInt32(0),
                    DepartmentCode = rdr.GetString(1),
                    DepartmentName = rdr.GetString(2),
                    CreatedAt = rdr.GetDateTime(3),
                    UpdatedAt = rdr.IsDBNull(4) ? (DateTime?)null : rdr.GetDateTime(4)
                });
            }
            return list;
        }

        public async Task<DepartmentDto?> GetByIdAsync(int id)
        {
            using var conn = new SqlConnection(_conn);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT DepartmentId, DepartmentCode, DepartmentName, CreatedAt, UpdatedAt FROM Departments WHERE DepartmentId=@id";
            cmd.Parameters.AddWithValue("@id", id);
            using var rdr = await cmd.ExecuteReaderAsync();
            if (await rdr.ReadAsync())
                return new DepartmentDto
                {
                    DepartmentId = rdr.GetInt32(0),
                    DepartmentCode = rdr.GetString(1),
                    DepartmentName = rdr.GetString(2),
                    CreatedAt = rdr.GetDateTime(3),
                    UpdatedAt = rdr.IsDBNull(4) ? (DateTime?)null : rdr.GetDateTime(4)
                };
            return null;
        }

        public async Task<int> CreateAsync(CreateDepartmentDto dto)
        {
            using var conn = new SqlConnection(_conn);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "INSERT INTO Departments (DepartmentCode, DepartmentName) VALUES (@code,@name); SELECT CAST(SCOPE_IDENTITY() AS int)";
            cmd.Parameters.AddWithValue("@code", dto.DepartmentCode);
            cmd.Parameters.AddWithValue("@name", dto.DepartmentName);
            var id = (int)await cmd.ExecuteScalarAsync();
            return id;
        }

        public async Task<bool> UpdateAsync(int id, UpdateDepartmentDto dto)
        {
            using var conn = new SqlConnection(_conn);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "UPDATE Departments SET DepartmentCode=@code, DepartmentName=@name, UpdatedAt=SYSDATETIME() WHERE DepartmentId=@id";
            cmd.Parameters.AddWithValue("@code", dto.DepartmentCode);
            cmd.Parameters.AddWithValue("@name", dto.DepartmentName);
            cmd.Parameters.AddWithValue("@id", id);
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqlConnection(_conn);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM Departments WHERE DepartmentId=@id";
            cmd.Parameters.AddWithValue("@id", id);
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }
    }
}
