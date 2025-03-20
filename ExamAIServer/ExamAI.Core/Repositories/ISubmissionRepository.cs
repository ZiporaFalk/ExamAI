using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Repositories
{
    public interface ISubmissionRepository
    {
 
        Task<Submission> GetAsync(int id, int exam_id);
        Task<List<Submission>> GetAllByIdAsync(int id);
        Task PostAsync(Submission newSubmission);
    }
}
