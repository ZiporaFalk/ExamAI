
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamAI.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<List<Student>> GetAllStudentsAsync()
        {
            return await _context.Users.OfType<Student>().ToListAsync();
        }
        public async Task<List<Student>> GetStudentsByClassAsync(string class_id)
        {
            return await _context.Users.OfType<Student>().Where(s => s.Class == class_id).ToListAsync();
        }
        public async Task<Manager> GetManagerAsync()
        {
            return await _context.Users.OfType<Manager>().FirstOrDefaultAsync();
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user != null)
            {
                _context.Users.Remove(user);
            }
        }

        public async Task UpdateAsync(int id, User newuser)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.Users.Add(newuser);
            }
        }
    }
}
