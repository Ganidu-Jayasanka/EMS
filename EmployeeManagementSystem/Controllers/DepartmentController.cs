using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace EmployeeManagementSystem.Controllers
{
    [ApiController]
    [Route("api/departments")]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepository _repo;
        public DepartmentController(IDepartmentRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _repo.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var d = await _repo.GetByIdAsync(id);
            if (d == null) return NotFound();
            return Ok(d);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateDepartmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var id = await _repo.CreateAsync(dto);
                return CreatedAtAction(nameof(Get), new { id }, new { id });
            }
            catch (SqlException ex) when (ex.Number == 2627)
            {
                return Conflict(new { message = "Department code or name already exists." });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateDepartmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var ok = await _repo.UpdateAsync(id, dto);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var ok = await _repo.DeleteAsync(id);
                if (!ok) return NotFound();
                return NoContent();
            }
            catch (SqlException)
            {
                return Conflict(new { message = "Cannot delete department. Make sure no employees reference this department." });
            }
        }
    }
}
