using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Models
{
    public class Feedback
    {
        public int Id { get; set; }
        public int Student_Id { get; set; }
        public int Exam_Id { get; set; }
        public string File_Url { get; set; }
        public int Score { get; set; }
        public DateTime Created_at { get; set; }
        public Feedback()
        {

        }

        public Feedback(int id, int student_Id, int exam_Id, string file_Url, int score, DateTime created_at)
        {
            Id = id;
            Student_Id = student_Id;
            Exam_Id = exam_Id;
            File_Url = file_Url;
            Score = score;
            Created_at = created_at;
        }
    }
}
