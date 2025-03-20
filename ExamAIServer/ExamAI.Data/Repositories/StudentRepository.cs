//using ExamAI.Core.Models;
//using ExamAI.Core.Repositories;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace ExamAI.Data.Repositories
//{
//    public class StudentRepository : IStudentRepository
//    {
//        private readonly DataContext _context;

//        public StudentRepository(DataContext context)
//        {
//            _context = context;
//        }
//        public List<Student> GetAll()
//        {
//            return _context.Users.OfType<Student>().ToList();
//            //IQueryable<User> users = _context.Users;
//            //List<Student> students = users.OfType<Student>().ToList();
//            //return students;
//        }
//        public Student GetById(int id)
//        {
//            return _context.Users.OfType<Student>().FirstOrDefault(x => x.Id == id);
//        }
//        public void Delete(int id)
//        {
//            Student student = _context.Users.OfType<Student>().FirstOrDefault(x => x.Id == id);
//            _context.Users.Remove(student);
//        }
//        public void Post(Student newstudent)//הרשמה
//        {
//            _context.Users.Add(newstudent);
//        } 
         
//    }
//}
