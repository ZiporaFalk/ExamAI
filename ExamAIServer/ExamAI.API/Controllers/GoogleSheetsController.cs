using ExamAI.Core.Services;
using ExamAI.Service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExamAI.API.Controllers
{
    //[Authorize(Policy = "AdminOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleSheetsController : ControllerBase
    {
        private readonly IGoogleSheetService _sheetService;

        public GoogleSheetsController(IGoogleSheetService sheetService)
        {
            _sheetService = sheetService;
            //_sheetService = new GoogleSheetService(); // או הזרקה אם תעדיפי
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _sheetService.GetStudentsAsync();
            return Ok(students);
        }

        [HttpGet("email")]
        public async Task<IActionResult> GetStudentEmail([FromQuery] string name, [FromQuery] string className)
        {
            var email = await _sheetService.FindStudentEmailAsync(name, className);
            if (email == null)
                return NotFound("התלמידה לא נמצאה");
            return Ok(new { email });
        }

        [HttpGet("email-exists")]
        public async Task<IActionResult> IsEmailExists(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("יש להזין כתובת מייל.");

            bool exists = await _sheetService.IsEmailExistsAsync(email);
            return Ok(new { exists });
        }


    }
}
