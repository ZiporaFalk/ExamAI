using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks; 

namespace ExamAI.Core.Models
{
    public class Exam
    {
        public int Id { get; set; }
        public string Class { get; set; }
        public int Subject { get; set; }
        public string Title { get; set; }
        public DateTime Created_at { get; set; } 
        public List<Answer> Answers { get; set; } 
        public List<Submission> Submissions { get; set; } 
        public Exam() 
        {

        }

        public Exam(int id, string @class, int subject, string title, DateTime created_at, List<Answer> answers, List<Submission> submissions)
        {
            Id = id;
            Class = @class;
            Subject = subject;
            Title = title;
            Created_at = created_at;
            Answers = answers;
            Submissions = submissions;
        }
    }
}
