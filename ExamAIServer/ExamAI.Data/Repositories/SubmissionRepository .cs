
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

        public async Task<Submission> GetAsync(int student_id, int exam_id)
        {
            return await _context.Submissions.FirstOrDefaultAsync(x => x.StudentId == student_id && x.ExamId == exam_id);
        }

        public async Task<List<Submission>> GetAllByIdAsync(int id)
        {
            return await _context.Submissions.Where(x => x.Id == id).ToListAsync();
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
        //public async Task UpdateScoreAsync(int studentId, int examId, int newScore)
        //{
        //    var Submission = await GetAsync(studentId, examId);
        //    Submission.Score = newScore;
        //    _context.Update(Submission);
        //    await _context.SaveChangesAsync();
        //}
        //public async Task UpdateUrlsAsync(int studentId, int examId, string urlFile, string urlFeedback)
        //{
        //    var Submission = await GetAsync(studentId, examId);
        //    Submission.File_Url = urlFile;
        //    Submission.File_Url_FeedBack = urlFeedback;
        //    _context.Update(Submission);
        //    await _context.SaveChangesAsync();
        //}
    }
}
