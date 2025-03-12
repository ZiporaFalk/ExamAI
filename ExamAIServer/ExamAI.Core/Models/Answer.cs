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
        public int Exam_Id { get; set; }
        public int QuestionNumber { get; set; }//מספר שאלה
        public int CorrectValue { get; set; }//התשובה הנכונה
        public int Value { get; set; }//  כמה שווה שאלה זו?

        public Answer()
        {

        }

        public Answer(int id, int exam_Id, int questionNumber, int correctValue, int value)
        {
            Id = id;
            Exam_Id = exam_Id;
            QuestionNumber = questionNumber;
            CorrectValue = correctValue;
            Value = value;
        }
    }
}
