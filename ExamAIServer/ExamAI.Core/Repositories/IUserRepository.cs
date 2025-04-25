using ExamAI.Core.DTOs.GetDto;
using ExamAI.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Repositories
{
    public interface IUserRepository
    {

        Task<List<User>> GetAllAsync();
        Task<List<Student>> GetAllStudentsAsync();
        Task<List<Student>> GetStudentsByClassAsync(string classs);
        Task<Student> GetStudentsByNameAndClassAsync(string classs, string name);
        Task<Manager> GetManagerAsync();
        Task<User> GetByIdAsync(int id);
        Task<Student> AddStudentAsync(Student student);
        Task DeleteAsync(int id);
        Task<User> UpdateAsync(int id, User newuser);
    }
}
