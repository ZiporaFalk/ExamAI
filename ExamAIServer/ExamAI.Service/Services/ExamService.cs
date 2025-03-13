using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class ExamService: IExamService
    {
        private readonly IExamRepository _examRepository;
        private readonly IRepositoryManager _repositoryManager;

        public ExamService(IExamRepository examRepository, IRepositoryManager repositoryManager)
        {
            _examRepository = examRepository;
            _repositoryManager = repositoryManager;
        }
        public Exam GetById(int id)
        {
            return _examRepository.GetById(id);
        }
        public void Post( Exam newexam)
        {
            _examRepository.Post(newexam);
            _repositoryManager.Save();
        }
    }
}
