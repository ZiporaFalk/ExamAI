using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Data.Repositories
{
    public class AnswerRepository
    {
        private readonly DataContext _context;

        public AnswerRepository(DataContext context)
        {
            _context = context;
        }
    }
}
