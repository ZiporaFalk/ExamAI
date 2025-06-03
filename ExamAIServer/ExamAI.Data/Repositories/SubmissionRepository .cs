
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
        public async Task<List<Submission>> GetAllAsync()
        {
            return await _context.Submissions.ToListAsync();
        }
        public async Task<List<Submission>> GetAllByStudentAsync(int student_id)
        {
            return await _context.Submissions
                                 .Where(x => x.StudentId == student_id)
                                 .ToListAsync();
        }

        public async Task<Submission> GetAsync(int student_id, int exam_id)
        {
            return await _context.Submissions.FirstOrDefaultAsync(x => x.StudentId == student_id && x.ExamId == exam_id);
        }

        public async Task<List<Submission>> GetAllByIdAsync(int id)
        {

            return await _context.Submissions.Include(s => s.Exam).Where(s => s.StudentId == id).ToListAsync();
            //return await _context.Submissions.Where(x => x.StudentId == id).ToListAsync();
        }

        public async Task PostAsync(Submission newSubmission)
        {
            await _context.Submissions.AddAsync(newSubmission);
        }
        public async Task<Submission> GetByIdAsync(int id)
        {
            return await _context.Submissions.FindAsync(id);
        }

        public async Task UpdateAsync(int id, Submission newSubmission)
        {
            var submission = await _context.Submissions.FirstOrDefaultAsync(s => s.Id == id);
            submission.Score = newSubmission.Score;
            submission.File_Url = newSubmission.File_Url;
            submission.File_Url_FeedBack = newSubmission.File_Url_FeedBack;
            await _context.SaveChangesAsync();
        }
        public async Task UpdateScoreAsync(int id, int score)
        {
            var submission = await _context.Submissions.FirstOrDefaultAsync(s => s.Id == id);
            submission.Score = score;

        }

        public async Task<double> GetAvgAsync(int studentId, string sub = null)
        {
            var query = _context.Submissions
                .Where(r => r.StudentId == studentId);

            if (!string.IsNullOrEmpty(sub))
            {
                query = query.Where(r => r.Exam.Subject == sub);
            }

            var scores = await query
                .Select(r => r.Score)
                .ToListAsync();

            if (!scores.Any())
                return 0;

            return (int)Math.Round(scores.Average());
        }
    
    }
}
