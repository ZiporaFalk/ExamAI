using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class UserService: IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRepositoryManager _repositoryManager;

        public UserService(IUserRepository userRepository,IRepositoryManager repositoryManager)
        {
            _userRepository = userRepository;
            _repositoryManager = repositoryManager;
        }
        public List<User> GetAll()
        {
            return _userRepository.GetAll();
        }
        public User GetById(int id)
        {
            return _userRepository.GetById(id);
        }
        public void Delete(int id)
        {
            _userRepository.Delete(id);
            _repositoryManager.Save();
        }
    }
}
