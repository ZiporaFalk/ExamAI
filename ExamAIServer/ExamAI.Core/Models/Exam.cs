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
        public string Subject { get; set; }
        public string Title { get; set; }
        public DateTime Created_at { get; set; } = DateTime.UtcNow;
        public List<Answer> Answers { get; set; }
        public List<Submission> Submissions { get; set; }
        public Exam()
        {
            Created_at = DateTime.UtcNow;
        }

        //public Exam(int id, string @class, int subject, string title, List<Answer> answers, List<Submission> submissions)
        //{
        //    Id = id;
        //    Class = @class;
        //    Subject = subject;
        //    Title = title;
        //    Answers = answers;
        //    Submissions = submissions;
        //}
    }
}
