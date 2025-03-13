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
    public class FeedbackService: IFeedbackService
    {
        private readonly FeedbackRepository _feedbackRepository;
        private readonly IRepositoryManager _repositoryManager;

        public FeedbackService(FeedbackRepository feedbackRepository, IRepositoryManager repositoryManager)
        {
            _feedbackRepository = feedbackRepository;
            _repositoryManager = repositoryManager;
        }
        public Feedback GetById(int id, int exam_id)
        {
            return _feedbackRepository.GetById(id, exam_id);
        }
        public void Post(Feedback newFeedback)
        {
            _feedbackRepository.Post(newFeedback);
            _repositoryManager.Save();
        }
    }
}
