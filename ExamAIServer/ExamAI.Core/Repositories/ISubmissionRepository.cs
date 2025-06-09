using ExamAI.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Repositories
{
    public interface ISubmissionRepository
    {
        Task<List<Submission>> GetAllByStudentAsync(int student_id);

        Task<Submission> GetAsync(int student_id, int exam_id);
        Task<List<Submission>> GetAllByIdAsync(int id);
        //////////
        Task<List<Submission>> GetAllSubmissionsAsync();
        ///
        Task PostAsync(Submission newSubmission);
        Task<Submission> GetByIdAsync(int id);
        Task UpdateAsync(int id, Submission submission);
        Task UpdateScoreAsync(int id, int score);
        Task<List<Submission>> GetAllAsync();
        Task<double> GetAvgAsync(int studentId, string sub = null);

    }
}
