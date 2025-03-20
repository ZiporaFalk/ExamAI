using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Repositories
{

    public interface IRepositoryManager
    {
        IUserRepository Users { get; }
        IExamRepository Exams { get; }
        IAnswerRepository Answers { get; }
        //IStudentRepository Students { get; }
        ISubmissionRepository Submissions { get; }
         Task SaveAsync();

    }

}
