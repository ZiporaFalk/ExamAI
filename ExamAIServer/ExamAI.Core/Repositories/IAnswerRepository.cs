using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Repositories
{
    public interface IAnswerRepository
    {
      
        Task<Answer> GetByIdAsync(int id, int exam_id);
        Task PostAsync(Answer newAnswer);
        Task<List<Answer>> GetAllAsync(int exam_id);
        Task DeleteAsync(int id);
    }
}
