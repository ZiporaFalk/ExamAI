using AutoMapper;
using ExamAI.Core.DTOs;
using ExamAI.Core.Models;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentservice;
        private readonly IMapper _mapper;

        public StudentController(IStudentService studentservice, IMapper mapper)
        {
            _studentservice = studentservice;
            _mapper = mapper;
        }

        [HttpGet]
        public IEnumerable<UserDto> Get()
        {
            var list = _studentservice.GetAll();
            return _mapper.Map<IEnumerable<UserDto>>(list);
        }

        [HttpGet("{id}")]
        public UserDto Get(int id)
        {
            var user = _studentservice.GetById(id);
            return _mapper.Map<UserDto>(user);
        }
        [HttpPost]
        public void Post([FromBody] StudentDto newstudent)//הרשמה
        {
            var student = _mapper.Map<Student>(newstudent);
            _studentservice.Post(student);
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
