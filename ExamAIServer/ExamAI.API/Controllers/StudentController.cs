using ExamAI.Core.Models;
using ExamAI.Service.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly StudentService _studentservice;
        public StudentController(StudentService studentservice)
        {
            _studentservice = studentservice;
        }

        [HttpGet]
        public IEnumerable<User> Get()
        {
            return _studentservice.GetAll();
        }

        [HttpGet("{id}")]
        public User Get(int id)
        {
            return _studentservice.GetById(id);
        }
        [HttpPost]
        public void Post([FromBody] Student newstudent)//הרשמה
        {
            _studentservice.Post(newstudent);
        }

        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{

        //}
        [HttpDelete]
        public void Delete(int id)
        {
            _studentservice.Delete(id);
        }
    }
}
