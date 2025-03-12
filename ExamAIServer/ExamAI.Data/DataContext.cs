using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Data
{
    public class DataContext
    {


        public List<User> Users { get; set; } 
        public List<Exam> Exams { get; set; }
        public List<Answer> Answers { get; set; }
        public List<Submission> Submissions { get; set; }
        public List<Feedback> Feedbacks { get; set; }



    }
}
