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
    public class SubmissionService
    {

        private readonly SubmissionRepository _submissionRepository;
        public SubmissionService(SubmissionRepository submissionRepository)
        {
            _submissionRepository = submissionRepository;
        }

        public Submission Get(int id, int exam_id)
        {
            return _submissionRepository.Get(id, exam_id);
        }
        public List<Submission> GetAllById(int id)
        {
            return _submissionRepository.GetAllById(id);
        }
    }
}
