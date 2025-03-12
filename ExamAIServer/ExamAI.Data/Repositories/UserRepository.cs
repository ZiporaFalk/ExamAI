using ExamAI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Data.Repositories
{
    public class UserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }
        public List<User> GetAll()
        {
            return _context.Users;
        }
        public User GetById(int id)
        {
            return _context.Users.FirstOrDefault(x => x.Id == id);
        }
        public void Delete(int id)
        {
            User user = _context.Users.FirstOrDefault(x => x.Id == id);
            _context.Users.Remove(user);
        }
    }
}
