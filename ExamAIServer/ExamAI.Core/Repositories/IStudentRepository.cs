using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Repositories
{
    public interface IStudentRepository
    {
        List<User> GetAll();

        User GetById(int id);

        void Delete(int id);

        void Post(Student newstudent);//הרשמה

    }
}
