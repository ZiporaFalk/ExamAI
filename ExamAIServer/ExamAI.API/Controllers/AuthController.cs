using ExamAI.Core.Models;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // הרשמה של משתמש חדש
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            // בדיקה אם המייל כבר קיים
            if (await _authService.IsEmailExistAsync(model.Email))
                return BadRequest("Email is already in use.");

            // יצירת משתמש חדש
            User newUser = model.Role.ToLower() switch
            {
                "student" => new Student { Name = model.Name, Email = model.Email, Password = model.Password, Class = model.Class },
                "admin" => new Manager { Name = model.Name, Email = model.Email, Password = model.Password },
                _ => throw new Exception("Invalid role")
            };

            await _authService.AddUserAsync(newUser);

            // יצירת טוקן עבור המשתמש
            var token = _authService.GenerateJwtToken(newUser);
            return Ok(new { Token = token });
        }

        // התחברות והחזרת טוקן
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _authService.GetUserByEmailAsync(model.Email);

            if (user == null)
                return Unauthorized("Invalid credentials");

            var token = _authService.GenerateJwtToken(user);
            return Ok(new { Token = token });
        }
    }

    public class RegisterModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Class { get; set; }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
