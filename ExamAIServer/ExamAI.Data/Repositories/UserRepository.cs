
using ExamAI.Core.DTOs.GetDto;
using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<List<Student>> GetStudentsByClassAsync(string classs)
        {
            return await _context.Users.OfType<Student>().Where(s => s.studentClass == classs).ToListAsync();
        }
        public async Task<Student> GetStudentsByNameAndClassAsync(string classs, string name)
        {
            return await _context.Users.OfType<Student>().FirstOrDefaultAsync(s => s.studentClass == classs && s.Name == name);
        }
        public async Task<Manager> GetManagerAsync()
        {
            return await _context.Users.OfType<Manager>().FirstOrDefaultAsync();
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<Student> AddStudentAsync(Student student)
        {
            if (student == null)
                throw new ArgumentNullException(nameof(student));

            // בדיקה אם כתובת האימייל כבר קיימת
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == student.Email);
            if (existingUser != null)
                throw new InvalidOperationException("A user with this email already exists.");

            // הוספת התלמיד למסד הנתונים
            _context.Users.Add(student);
            await _context.SaveChangesAsync();

            return student;
        }
        public async Task DeleteAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user != null)
            {
                _context.Users.Remove(user);
            }
        }

        //public async Task<ActionResult> UpdateAsync(int id, User newuser)
        //{
        //    var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
        //    if (user != null)
        //    {
        //        _context.Users.Remove(user);
        //        _context.Users.Add(newuser);
        //    }
        //}
        public async Task<User> UpdateAsync(int id, User newUser)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (existingUser == null)
            {
                return null; // אם המשתמש לא נמצא
            }
            existingUser.Name = newUser.Name;
            existingUser.Email = newUser.Email;
            existingUser.Password = newUser.Password;
            if (existingUser is Student existingStudent && newUser is Student newStudent)
            {
                existingStudent.studentClass = newStudent.studentClass;
            }
            _context.Users.Update(existingUser);
            await _context.SaveChangesAsync();

            return existingUser;
        }

    }
}
