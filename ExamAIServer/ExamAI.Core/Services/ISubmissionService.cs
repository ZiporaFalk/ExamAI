using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Services
{
    public interface ISubmissionService
    {

        Task<Submission> GetAsync(int student_id, int exam_id);
        Task<List<Submission>> GetAllByIdAsync(int id);
        Task PostAsync(Submission newSubmission);
        //////
        ///
        Task<Submission> GetByIdAsync(int id);
        Task UpdateAsync(int id, Submission submission);
        Task UpdateScoreAsync(int id, int score);

        //Task UpdateScoreAsync(int studentId, int examId, int newScore);
        //Task UpdateUrlsAsync(int studentId, int examId, string urlFile, string urlFeedback);

        //
        Task<List<Submission>> GetAllAsync();
    }
}
