using ExamAI.Core.Models;
using ExamAI.Service.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {

        private readonly ExamService _examservice;
        public ExamController(ExamService examservice)
        {
            _examservice = examservice;
        }
        
        [HttpGet] 
        public Exam GetById(int id)
        {
            return _examservice.GetById(id);
        }

        // GET api/<ExamController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ExamController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ExamController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ExamController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
