using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class ExamService
    {
        private readonly ExamRepository _examRepository;
        public ExamService(ExamRepository examRepository)
        {
            _examRepository = examRepository;
        }
        public Exam GetById(int id)
        {
            return _examRepository.GetById(id);
        }
    }
}
