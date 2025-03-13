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
    public class SubmissionService: ISubmissionService
    {

        private readonly SubmissionRepository _submissionRepository;
        private readonly IRepositoryManager _repositoryManager;

        public SubmissionService(SubmissionRepository submissionRepository, IRepositoryManager repositoryManager)
        {
            _submissionRepository = submissionRepository;
            _repositoryManager = repositoryManager;
        }

        public Submission Get(int id, int exam_id)
        {
            return _submissionRepository.Get(id, exam_id);
        }
        public List<Submission> GetAllById(int id)
        {
            return _submissionRepository.GetAllById(id);
        }
        public void Post( Submission newSubmission)
        {
            _submissionRepository.Post(newSubmission);
            _repositoryManager.Save();
        }
    }
}
