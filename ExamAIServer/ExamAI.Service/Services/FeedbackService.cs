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
    public class FeedbackService
    {
        private readonly FeedbackRepository _feedbackRepository;
        public FeedbackService(FeedbackRepository feedbackRepository)
        {
            _feedbackRepository = feedbackRepository;
        }
        public Feedback GetById(int id, int exam_id)
        {
            return _feedbackRepository.GetById(id, exam_id);
        }

    }
}
