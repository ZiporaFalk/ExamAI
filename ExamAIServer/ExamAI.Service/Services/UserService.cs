
using ExamAI.Core.DTOs.GetDto;
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using ExamAI.Data.Repositories;
using ExamAI.Service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;
using CSharpFunctionalExtensions;

namespace ExamAI.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRepositoryManager _repositoryManager;
        private readonly IGoogleSheetService _googleSheetService;

        public UserService(IUserRepository userRepository, IRepositoryManager repositoryManager, IGoogleSheetService googleSheetService)
        {
            _userRepository = userRepository;
            _repositoryManager = repositoryManager;
            _googleSheetService = googleSheetService;
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
        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            // תבנית פשוטה לבדיקת אימייל תקני
            var regex = new System.Text.RegularExpressions.Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            return regex.IsMatch(email);
        }
        private bool IsValidPassword(string password)
        {
            return password.Length >= 6;
        }

        private async Task<Result> ValidateUserAsync(User user, int id = 0)
        {
            if (!await _googleSheetService.IsEmailExistsAsync(user.Email))
                return Result.Failure("This user is not allowed to connect");

            if (string.IsNullOrWhiteSpace(user.Email))
                return Result.Failure("Email is required");

            if (string.IsNullOrWhiteSpace(user.Name))
                return Result.Failure("Name is required");

            if (string.IsNullOrWhiteSpace(user.Password))
                return Result.Failure("Password is required");

            if (user is Student student && string.IsNullOrWhiteSpace(student.studentClass))
                return Result.Failure("Student class is required");

            if (!IsValidEmail(user.Email))
                return Result.Failure("Invalid email format");

            if (!IsValidPassword(user.Password))
                return Result.Failure("Invalid password");

            var existingUser = await _userRepository.GetStudentByEmailAsync(user.Email);
            if (existingUser != null && existingUser.Id != id)
                return Result.Failure("This email already exists");

            return Result.Success();
        }

        public async Task<Result<Student>> AddStudentAsync(Student student)
        {
            var validationResult = await ValidateUserAsync(student, student.Id);
            if (validationResult.IsFailure)
                return Result.Failure<Student>(validationResult.Error);

            var addedStudent = await _userRepository.AddStudentAsync(student);
            return Result.Success(addedStudent);
        }

        public async Task<User> UpdateAsync(int id, User newUser)
        {
            // לא קוראים ל SaveAsync לפני, כי ה Save צריך לקרות אחרי העדכון
            var updatedUser = await _userRepository.UpdateAsync(id, newUser);
            if (updatedUser != null)
            {
                await _repositoryManager.SaveAsync();
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

