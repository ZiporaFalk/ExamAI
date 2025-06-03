using CSharpFunctionalExtensions;
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using ExamAI.Service.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IAuthRepository _authRepository;
    private readonly IRepositoryManager _repositoryManager;
    private readonly IGoogleSheetService _googleSheetService;
    public AuthService(IConfiguration configuration, IAuthRepository authRepository,
        IRepositoryManager repositoryManager,
        IGoogleSheetService googleSheetService)
    {
        _configuration = configuration;
        _authRepository = authRepository;
        _repositoryManager = repositoryManager;
        _googleSheetService = googleSheetService;
    }

    public string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        // הוספת תפקיד כ-Claim
        if (user is Student)
            claims.Add(new Claim(ClaimTypes.Role, "Student"));
        else if (user is Manager)
            claims.Add(new Claim(ClaimTypes.Role, "Admin"));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<bool> IsEmailExistAsync(string email)
    {
        return await _authRepository.IsEmailExistAsync(email);
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        return await _authRepository.GetUserByEmailAsync(email);
    }
    public async Task<Result> AddUserAsync(User user)
    {
        if (!await _googleSheetService.IsEmailExistsAsync(user.Email))
        {
            Console.WriteLine("-=-=-=-==-=-");
            return Result.Failure("This user is not allowed to connect");
        }
        await _authRepository.AddUserAsync(user);
        //await _userService.AddStudentAsync(user);
        await _repositoryManager.SaveAsync();

        return Result.Success(); // if applicable
    }
    public async Task AddUserAdminAsync(User user)
    {
        await _authRepository.AddUserAsync(user);
        await _repositoryManager.SaveAsync();
    }
    //public async Task AddUserAsync(User user)
    //{
    //    if (!await _googleSheetService.IsEmailExistsAsync(user.Email))
    //        return Result.Failure("This user is not allowed to connect");
    //    await _authRepository.AddUserAsync(user);
    //    //await _userService.AddStudentAsync(user);
    //    await _repositoryManager.SaveAsync();
    //}
}
