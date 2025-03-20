
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
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

        public async Task<Exam> GetByIdAsync(int id)
        {
            return await _examRepository.GetByIdAsync(id);
        }

        public async Task PostAsync(Exam newexam)
        {
            await _examRepository.PostAsync(newexam);
            await _repositoryManager.SaveAsync();
        }
    }
}
