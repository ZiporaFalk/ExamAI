
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
    public class AnswerRepository : IAnswerRepository
    {
        private readonly DataContext _context;

        public AnswerRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Answer>> GetAllAsync(int exam_id)
        {
            return await _context.Answers.Where(x => x.ExamId == exam_id).ToListAsync();
        }

        public async Task<Answer> GetByIdAsync(int id, int exam_id)
        {
            return await _context.Answers.FirstOrDefaultAsync(x => x.Id == id && x.ExamId == exam_id);
        }

        public async Task PostAsync(Answer newAnswer)
        {
            await _context.Answers.AddAsync(newAnswer);
        }

        public async Task DeleteAsync(int id)
        {
            var answer = await _context.Answers.FindAsync(id);
            if (answer != null)
            {
                _context.Answers.Remove(answer);
            }
        }
    }
}