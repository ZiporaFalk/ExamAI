using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Models
{
    public class Submission
    {
        public int Id { get; set; }
        public int StudentId { get; set; }         
        public Student Student { get; set; }
        public int ExamId { get; set; }
        public Exam Exam { get; set; }
        public string File_Url { get; set; }
        public string File_Url_FeedBack { get; set; }
        public int Score { get; set; }
        public DateTime Created_at { get; set; } = DateTime.UtcNow;

        public Submission()
        {
            Created_at= DateTime.UtcNow;
        }

        //public Submission(int id, int studentId, Student student, int examId, Exam exam, string file_Url, string file_Url_FeedBack, int score)
        //{
        //    Id = id;
        //    StudentId = studentId;
        //    Student = student;
        //    ExamId = examId;
        //    Exam = exam;
        //    File_Url = file_Url;
        //    File_Url_FeedBack = file_Url_FeedBack;
        //    Score = score;
        //}
    }
}
