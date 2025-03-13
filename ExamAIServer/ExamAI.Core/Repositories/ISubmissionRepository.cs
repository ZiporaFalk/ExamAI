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
        Submission Get(int id, int exam_id);

        List<Submission> GetAllById(int id);

        void Post(Submission newSubmission);
      
    }
}
