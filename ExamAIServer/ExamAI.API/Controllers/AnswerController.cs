using ExamAI.Core.Models;
using ExamAI.Service.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {

        private readonly AnswerService _answerservice;
        public AnswerController(AnswerService answerservice)
        {
            _answerservice = answerservice;
        }

        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        [HttpGet("{id}")]
        public Answer Get(int id, int exam_id)
        {
            return _answerservice.GetById(id, exam_id);
        }

        [HttpPost]
        public void Post([FromBody] Answer newAnswer)
        {
            _answerservice.Post(newAnswer);
        }

        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
