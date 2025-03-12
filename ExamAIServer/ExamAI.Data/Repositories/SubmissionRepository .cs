using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Data.Repositories
{
    public class SubmissionRepository
    {
        private readonly DataContext _context;

        public SubmissionRepository(DataContext context)
        {
            _context = context;
        }
        public Submission Get(int id, int exam_id)
        {
            return _context.Submissions.FirstOrDefault(x => x.Id == id && x.Exam_Id == exam_id);
        }
        public List<Submission> GetAllById(int id)
        {
            return _context.Submissions.FindAll(x => x.Id == id);
        }
    }
}
