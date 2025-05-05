
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class AnswerService : IAnswerService
    {
        private readonly IAnswerRepository _answerRepository;
        private readonly IRepositoryManager _repositoryManager;

        public AnswerService(IAnswerRepository answerRepository, IRepositoryManager repositoryManager)
        {
            _answerRepository = answerRepository;
            _repositoryManager = repositoryManager;
        } 

        public async Task<List<Answer>> GetAllAsync(int exam_id)
        {
            return await _answerRepository.GetAllAsync(exam_id);
        }

        public async Task<Answer> GetByIdAsync(int id, int exam_id)
        {
            return await _answerRepository.GetByIdAsync(id, exam_id);
        }

        public async Task PostAsync(Answer newAnswer)
        {
            await _answerRepository.PostAsync(newAnswer);
            await _repositoryManager.SaveAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _answerRepository.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
        }
    }
}
