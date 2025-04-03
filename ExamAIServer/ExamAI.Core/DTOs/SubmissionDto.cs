using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.DTOs
{
    public class SubmissionDto
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        //public Student Student { get; set; }
        public int ExamId { get; set; }
        //public Exam Exam { get; set; }
        public string File_Url { get; set; }
        public string File_Url_FeedBack { get; set; }
        public int Score { get; set; }

    }
}
