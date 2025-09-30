using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace EmployeeManagementSystem.Controllers
{
    [ApiController]
    [Route("api/employees")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository _repo;
        public EmployeeController(IEmployeeRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _repo.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return NotFound();
            return Ok(e);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateEmployeeDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (dto.DOB > DateTime.Today)
                return BadRequest(new { message = "DOB cannot be in the future." });

            try
            {
                var id = await _repo.CreateAsync(dto);
                return CreatedAtAction(nameof(Get), new { id }, new { id });
            }
            catch (SqlException ex) when (ex.Number == 2627)
            {
                return Conflict(new { message = "Email already exists." });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateEmployeeDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (dto.DOB > DateTime.Today)
                return BadRequest(new { message = "DOB cannot be in the future." });

            var ok = await _repo.UpdateAsync(id, dto);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _repo.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
