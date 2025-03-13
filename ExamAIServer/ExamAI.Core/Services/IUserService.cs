using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Services
{
    public interface IUserService
    {
        List<User> GetAll();
        User GetById(int id);
        void Delete(int id);
    }
}
