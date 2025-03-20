using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly DataContext _context;
        public IUserRepository Users { get; }
        public IExamRepository Exams { get; }
        public IAnswerRepository Answers { get; }
        //public IStudentRepository Students { get; }
        public ISubmissionRepository Submissions { get; }

        public RepositoryManager(DataContext context, IUserRepository users, IExamRepository exams, IAnswerRepository answers, ISubmissionRepository submissions)
        {
            _context = context;
            Users = users;
            Exams = exams;
            Answers = answers;
            //Students = students;
            Submissions = submissions;
        }

        //public void Save()
        //{
        //    _context.SaveChanges();
        //}
        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
