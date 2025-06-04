using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public Exam Exam { get; set; }
        public char QuestionNumber { get; set; }
        public int CorrectAnswer { get; set; }
        public DateTime Created_at { get; set; } = DateTime.UtcNow;

        public Answer()
        {
            Created_at = DateTime.UtcNow;
        }

        //public Answer(int id, int examId, Exam exam, int questionNumber, int correctValue, int value)
        //{
        //    Id = id;
        //    ExamId = examId;
        //    Exam = exam;
        //    QuestionNumber = questionNumber;
        //    CorrectValue = correctValue;
        //    Value = value;
        //}
    }
}
