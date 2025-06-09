using ExamAI.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            //Console.WriteLine("=== DbContext נוצר === " + DateTime.Now.ToString("HH:mm:ss.fff"));
        }
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    //optionsBuilder.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=sample_db");
        //    //var connectionString = _configuration.GetConnectionString("ExamAIDB");
        //    //optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        //}
 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // פתרון בעיית ה-Discriminator
            modelBuilder.Entity<User>()
                .HasDiscriminator<string>("Role")
                .HasValue<Student>("Student")
                .HasValue<Manager>("Manager");
        }

    }
}
