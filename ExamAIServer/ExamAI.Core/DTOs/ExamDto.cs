using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.DTOs
{
    public class ExamDto
    {
        //public int Id { get; set; }
        //public string Class { get; set; }
        public string Subject { get; set; }
        public string File_Url { get; set; }
        public string DateExam { get; set; }
        //public List<Answer> Answers { get; set; }
        //public List<Submission> Submissions { get; set; }
    }
}
