
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamAI.Data.Repositories
{
    public class SubmissionRepository : ISubmissionRepository
    {
        private readonly DataContext _context;

        public SubmissionRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Submission> GetAsync(int id, int exam_id)
        {
            return await _context.Submissions.FirstOrDefaultAsync(x => x.Id == id && x.ExamId == exam_id);
        }

        public async Task<List<Submission>> GetAllByIdAsync(int id)
        {
            return await _context.Submissions.Where(x => x.Id == id).ToListAsync();
        }

        public async Task PostAsync(Submission newSubmission)
        {
            await _context.Submissions.AddAsync(newSubmission);
        }
    }
}
