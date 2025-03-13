using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using ExamAI.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class AnswerService: IAnswerService
    {
        private readonly AnswerRepository _answerRepository;
        private readonly IRepositoryManager _repositoryManager;

        public AnswerService(AnswerRepository answerRepository,IRepositoryManager repositoryManager)
        {
            _answerRepository = answerRepository;
            _repositoryManager = repositoryManager;
        }
        public Answer GetById(int id, int exam_id)
        {
            return _answerRepository.GetById(id, exam_id);
        }
        public void Post(Answer newAnswer)
        {
            _answerRepository.Post(newAnswer);
            _repositoryManager.Save();
        }
    }
}
