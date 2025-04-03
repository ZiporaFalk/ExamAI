using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.DTOs
{
    public class AnswerDto
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        //public Exam Exam { get; set; }
        public int QuestionNumber { get; set; }//מספר שאלה
        public int CorrectValue { get; set; }//התשובה הנכונה
        public int Value { get; set; }//  כמה שווה שאלה זו?

    }
}
