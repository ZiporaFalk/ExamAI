
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
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
        public async Task<List<Student>> GetStudentsByClassAsync(string class_id)
        {
            return await _userRepository.GetStudentsByClassAsync(class_id);
        }
        public async Task<Manager> GetManagerAsync()
        {
            return await _userRepository.GetManagerAsync();
        }

        public async Task UpdateAsync(int id, User newuser)
        {
            await _userRepository.UpdateAsync(id, newuser);
            await _repositoryManager.SaveAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _userRepository.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
        }
    }
}
