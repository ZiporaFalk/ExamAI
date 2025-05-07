
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
        public async Task<List<Submission>> GetAllAsync()
        {
            return await _submissionRepository.GetAllAsync();
        }

        public async Task<Submission> GetAsync(int student_id, int exam_id)
        {
            return await _submissionRepository.GetAsync(student_id, exam_id);
        }

        public async Task<List<Submission>> GetAllByIdAsync(int id)
        {
            return await _submissionRepository.GetAllByIdAsync(id);
        }


        public async Task<Submission> GetByIdAsync(int id)
        {
            return await _submissionRepository.GetByIdAsync(id);
        }
        public async Task PostAsync(Submission newSubmission)
        {
            await _submissionRepository.PostAsync(newSubmission);
            await _repositoryManager.SaveAsync();
        }
        public async Task UpdateAsync(int id, Submission submission)
        {
            await _submissionRepository.UpdateAsync(id, submission);
            await _repositoryManager.SaveAsync();
        }
        public async Task UpdateScoreAsync(int id, int score)
        {
            await _submissionRepository.UpdateScoreAsync(id, score);
            await _repositoryManager.SaveAsync();
        }
        
        //public async Task UpdateScoreAsync(int studentId, int examId, int newScore)
        //{
        //    await _submissionRepository.UpdateScoreAsync(studentId, examId, newScore);
        //    await _repositoryManager.SaveAsync();
        //}
        //public async Task UpdateUrlsAsync(int studentId, int examId, string urlFile, string urlFeedback)
        //{
        //    await _submissionRepository.UpdateUrlsAsync(studentId, examId, urlFile, urlFeedback);
        //    await _repositoryManager.SaveAsync();
        //}
    }
}

