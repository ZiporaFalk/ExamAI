using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Data.Repositories
{
    public class ExamRepository: IExamRepository
    {
        private readonly DataContext _context;

        public ExamRepository(DataContext context)
        {
            _context = context;
        }
        public Exam GetById(int id)
        {
            return _context.Exams.FirstOrDefault(x => x.Id == id);
        }
        public void Post(Exam newexam)
        {
           _context.Exams.Add(newexam);
        }
    }
}
