using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Models
{
    public abstract class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public DateTime Created_at { get; set; } = DateTime.UtcNow;

        public User()
        {
            Created_at = DateTime.UtcNow;

        }

        //public User(int id, string name, string email, string password)
        //{
        //    Id = id;
        //    Name = name;
        //    Email = email;
        //    Password = password;
        //}
    }
}
