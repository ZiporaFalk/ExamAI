
using ExamAI.Core.DTOs.GetDto;
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRepositoryManager _repositoryManager;

        public UserService(IUserRepository userRepository, IRepositoryManager repositoryManager)
        {
            _userRepository = userRepository;
            _repositoryManager = repositoryManager;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }
        public async Task<List<Student>> GetAllStudentsAsync()
        {
            return await _userRepository.GetAllStudentsAsync();
        }
        public async Task<List<Student>> GetStudentsByClassAsync(string classs)
        {
            return await _userRepository.GetStudentsByClassAsync(classs);
        }
        public async Task<Student> GetStudentsByNameAndClassAsync(string classs, string name)
        {
            return await _userRepository.GetStudentsByNameAndClassAsync(classs, name);
        }
        public async Task<Manager> GetManagerAsync()
        {
            return await _userRepository.GetManagerAsync();
        }
        public async Task<Student> AddStudentAsync(Student student)
        {
            return await _userRepository.AddStudentAsync(student);
        }
        public async Task<User> UpdateAsync(int id, User newUser)
        {
            // לא קוראים ל SaveAsync לפני, כי ה Save צריך לקרות אחרי העדכון
            var updatedUser = await _userRepository.UpdateAsync(id, newUser);
            if (updatedUser != null)
            {
                await _repositoryManager.SaveAsync(); // מבצע את השמירה אחרי העדכון
            }
            return updatedUser;
        }



        public async Task DeleteAsync(int id)
        {
            await _userRepository.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
        }
    }
}
