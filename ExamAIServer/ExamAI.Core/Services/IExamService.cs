using ExamAI.Core.DTOs.GetDto;
using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Services
{
    public interface IExamService
    {
        Task<List<Exam>> GetAsync();
        Task<Exam> GetByIdAsync(int id);
        Task<Exam> GetBySubjectAndDateAsync(string dateExam, string subject);

        Task PostAsync(Exam newexam);
    }
}
