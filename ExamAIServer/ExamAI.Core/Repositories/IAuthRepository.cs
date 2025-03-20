using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Repositories
{
    public interface IAuthRepository
    {
       
        Task<bool> IsEmailExistAsync(string email);
        Task<User> GetUserByEmailAsync(string email);
        Task AddUserAsync(User user);
    }
}
