using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Repositories
{
    public interface IFeedbackRepository
    {
        Feedback GetById(int id, int exam_id);
        
         void Post(Feedback newFeedback);
      
    }
}
