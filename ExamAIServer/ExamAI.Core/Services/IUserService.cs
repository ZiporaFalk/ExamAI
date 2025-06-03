using ExamAI.Core.DTOs.GetDto;
using ExamAI.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CSharpFunctionalExtensions;

namespace ExamAI.Core.Services
{
    public interface IUserService
    {

        Task<List<User>> GetAllAsync();
        Task<List<Student>> GetAllStudentsAsync();
        Task<List<Student>> GetStudentsByClassAsync(string classs);
        Task<Student> GetStudentsByNameAndClassAsync(string classs, string name);
        Task<Manager> GetManagerAsync();
        Task<User> GetByIdAsync(int id);
        //Task<Student> AddStudentAsync(Student student);
        Task<Result<Student>> AddStudentAsync(Student student);
        Task DeleteAsync(int id);
        Task<User> UpdateAsync(int id, User newuser);
        //Task<string?> ValidateUserAsync(User user, int id = 0);
    }
}
