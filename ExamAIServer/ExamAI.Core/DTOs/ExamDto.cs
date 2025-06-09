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

        public string Subject { get; set; }
        public string File_Url { get; set; }
        public string DateExam { get; set; }
        public DateTime Created_at { get; set; }
    }
}
