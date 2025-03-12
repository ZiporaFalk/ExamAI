using ExamAI.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class AnswerService
    {
        private readonly AnswerRepository _answerRepository;
        public AnswerService(AnswerRepository answerRepository)
        {
            _answerRepository = answerRepository;
        }
    }
}
