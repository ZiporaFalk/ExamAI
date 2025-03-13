using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using ExamAI.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class StudentService: IStudentService
    {
        private readonly StudentRepository _studentRepository;
        private readonly IRepositoryManager _repositoryManager;

        public StudentService(StudentRepository studentRepository,IRepositoryManager repositoryManager)
        {
            _studentRepository = studentRepository;
            _repositoryManager = repositoryManager;
        }
        public List<User> GetAll()
        {
            return _studentRepository.GetAll();
        }
        public User GetById(int id)
        {
            return _studentRepository.GetById(id);
        }
        public void Delete(int id)
        {
            _studentRepository.Delete(id);
            _repositoryManager.Save();
        }
        public void Post(Student newstudent)//הרשמה
        {
            _studentRepository.Post(newstudent);
            _repositoryManager.Save();
        }
    }
}
