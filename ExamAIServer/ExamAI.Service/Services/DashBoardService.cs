using ExamAI.Core.Models;
using ExamAI.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class DashBoardService : IDashBoardService
    {
        private readonly IUserService _userService;
        private readonly ISubmissionService _submissionService;

        public DashBoardService(IUserService userService, ISubmissionService submissionService)
        {
            _userService = userService;
            _submissionService = submissionService;
        }

        public async Task<double> GetClassAvgAsync(string className = null, string subject = null)
        {
            List<Student> classList;
            if (string.IsNullOrEmpty(className))
                classList = await _userService.GetAllStudentsAsync(); // פונקציה שמחזירה את כל התלמידים
            else
                classList = await _userService.GetStudentsByClassAsync(className);
            if (classList == null || !classList.Any())
                return 0;
            double sum = 0, count = 0;
            foreach (var student in classList)
            {
                var avg = await _submissionService.GetAvgAsync(student.Id, subject);
                Console.WriteLine(student.Id + ";" + avg);
                sum += avg;
                count++;
            }
            return count == 0 ? 0 : sum / count;
        }
        public async Task<double> GetAvgOfStudentAsync(int studentId, string sub = null)
        {
            return await _submissionService.GetAvgAsync(studentId, null);
        }

        public async Task<double> GetPassRateAsync(string className = null, string subject = null)
        {
            List<Student> students;
            // שליפת רשימת תלמידים לפי כיתה או כללית
            if (string.IsNullOrEmpty(className))
                students = await _userService.GetAllStudentsAsync();
            else
                students = await _userService.GetStudentsByClassAsync(className);
            if (students == null || !students.Any())
                return 0;
            int passedCount = 0;
            foreach (var student in students)
            {
                double avg = await _submissionService.GetAvgAsync(student.Id, subject);
                if (avg >= 60)
                    passedCount++;
            }
            double passRate = (double)passedCount / students.Count * 100;
            return Math.Round(passRate, 2); // אחוז עם שתי ספרות אחרי הנקודה
        }
        public async Task<List<Submission>> GetExamBySubAndClassAsync(string className = null, string subject = null)
        {
            List<Student> students;
            // שליפת רשימת תלמידים לפי כיתה או כללית
            if (string.IsNullOrEmpty(className))
                students = await _userService.GetAllStudentsAsync();
            else
                students = await _userService.GetStudentsByClassAsync(className);
            if (students == null || !students.Any())
                return new List<Submission>();
            var allSubmissions = new List<Submission>();
            foreach (var student in students)
            {
                var studentSubmissions = await _submissionService.GetAllByIdAsync(student.Id);
                Console.WriteLine(student.Id + ": " + studentSubmissions.Count);
                if (!string.IsNullOrEmpty(subject))
                {
                    studentSubmissions = studentSubmissions
                        //.Where(s => s.Exam != null && s.Exam.Subject?.Equals(subject, StringComparison.OrdinalIgnoreCase) == true)
                        .Where(s => s.Exam.Subject?.Equals(subject, StringComparison.OrdinalIgnoreCase) == true)
                        .ToList();
                }
                allSubmissions.AddRange(studentSubmissions);
            }
            return allSubmissions;
        }
    }
}

