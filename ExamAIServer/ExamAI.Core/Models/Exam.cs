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
        public DateTime created_at { get; set; }
        public Exam()
        {

        }
        public Exam(int id, string @class, int subject, DateTime created_at)
        {
            Id = id;
            Class = @class;
            this.Subject = subject;
            this.created_at = created_at;
        }
    }
}
