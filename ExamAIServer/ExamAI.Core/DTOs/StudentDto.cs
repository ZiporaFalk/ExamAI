using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.DTOs
{
    public class StudentDto : UserDto
    {
        public int Id { get; set; }

        public string studentClass { get; set; }
        //public List<Submission> submissions { get; set; }
    }
}
