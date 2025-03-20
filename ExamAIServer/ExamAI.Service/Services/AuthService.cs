using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
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

    public AuthService(IConfiguration configuration, IAuthRepository authRepository, IRepositoryManager repositoryManager)
    {
        _configuration = configuration;
        _authRepository = authRepository;
        _repositoryManager = repositoryManager;
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

    public async Task AddUserAsync(User user)
    {
        await _authRepository.AddUserAsync(user);
        await _repositoryManager.SaveAsync();
    }
}
