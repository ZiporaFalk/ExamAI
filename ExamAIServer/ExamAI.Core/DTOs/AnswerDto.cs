﻿using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.DTOs
{
    public class AnswerDto
    {
        //public int Id { get; set; }
        public int ExamId { get; set; }
        //public Exam Exam { get; set; }
        public char QuestionNumber { get; set; }//מספר שאלה
        public int CorrectAnswer { get; set; }//התשובה הנכונה

    }
}
