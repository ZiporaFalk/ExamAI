using ExamAI.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        //public List<User> Users { get; set; }
        //public List<Exam> Exams { get; set; }
        //public List<Answer> Answers { get; set; }
        //public List<Submission> Submissions { get; set; }
        //public List<Feedback> Feedbacks { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=sample_db");
        }
        //public DataContext()
        //{
        //    Users = new List<User>() { new Student(1, "יעל", "a@a", "123", "ה2"), new Student(2, "רחלי", "b@a", "234", "ה1") };
        //    Answers = new List<Answer>() { new Answer(1, 1, 1, 1, 1), new Answer(2, 2, 2, 2, 2), new Answer(3, 3, 3, 3, 3) };
        //    Exams = new List<Exam>() { new Exam() };
        //    Submissions = new List<Submission>() { new Submission() };
        //    Feedbacks = new List<Feedback>() { new Feedback() };
        //}

    }
}
