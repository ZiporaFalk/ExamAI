
using ExamAI.Core.DTOs;
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace ExamAI.Data.Repositories
{
    public class ExamRepository : IExamRepository
    {
        private readonly DataContext _context;

        public ExamRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<List<Exam>> GetAsync()
        {
            return await _context.Exams.ToListAsync();
        }
        public async Task<Exam> GetByIdAsync(int id)
        {
            return await _context.Exams.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task PostAsync(Exam newexam)
        {
            await _context.Exams.AddAsync(newexam);
        }
    }
}
