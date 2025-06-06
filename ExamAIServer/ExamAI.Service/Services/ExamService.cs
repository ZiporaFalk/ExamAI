﻿
using ExamAI.Core.DTOs.GetDto;
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class ExamService : IExamService
    {
        private readonly IExamRepository _examRepository;
        private readonly IRepositoryManager _repositoryManager;

        public ExamService(IExamRepository examRepository, IRepositoryManager repositoryManager)
        {
            _examRepository = examRepository;
            _repositoryManager = repositoryManager;
        }
        public async Task<List<Exam>> GetAsync()
        {
            return await _examRepository.GetAsync();
        }
        public async Task<Exam> GetByIdAsync(int id)
        {
            return await _examRepository.GetByIdAsync(id);
        }
        public async Task<Exam> GetBySubjectAndDateAsync(string dateExam, string subject)
        {
            return await _examRepository.GetBySubjectAndDateAsync(dateExam, subject);
        }
        public async Task PostAsync(Exam newexam)
        {
            await _examRepository.PostAsync(newexam);
            await _repositoryManager.SaveAsync();
        }
    }
}
