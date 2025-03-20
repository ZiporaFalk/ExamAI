
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class SubmissionService : ISubmissionService
    {
        private readonly ISubmissionRepository _submissionRepository;
        private readonly IRepositoryManager _repositoryManager;

        public SubmissionService(ISubmissionRepository submissionRepository, IRepositoryManager repositoryManager)
        {
            _submissionRepository = submissionRepository;
            _repositoryManager = repositoryManager;
        }

        public async Task<Submission> GetAsync(int id, int exam_id)
        {
            return await _submissionRepository.GetAsync(id, exam_id);
        }

        public async Task<List<Submission>> GetAllByIdAsync(int id)
        {
            return await _submissionRepository.GetAllByIdAsync(id);
        }

        public async Task PostAsync(Submission newSubmission)
        {
            await _submissionRepository.PostAsync(newSubmission);
            await _repositoryManager.SaveAsync();
        }
    }
}

