using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Services
{
    public interface IUserService
    {

        Task<List<User>> GetAllAsync();
        Task<List<Student>> GetAllStudentsAsync();
        Task<List<Student>> GetStudentsByClassAsync(string class_id);
        Task<Manager> GetManagerAsync();
        Task<User> GetByIdAsync(int id);
        Task DeleteAsync(int id);
        Task UpdateAsync(int id, User newuser);
    }
}
