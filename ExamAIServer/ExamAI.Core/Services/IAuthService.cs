using CSharpFunctionalExtensions;
using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Services
{
    public interface IAuthService
    {

        string GenerateJwtToken(User user);
        Task<bool> IsEmailExistAsync(string email);
        Task<User> GetUserByEmailAsync(string email);
        //Task AddUserAsync(User user);
        Task<Result> AddUserAsync(User user);
        Task AddUserAdminAsync(User user);

    }
}
