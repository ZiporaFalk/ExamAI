using ExamAI.Core.Models;
using ExamAI.Service.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {

        private readonly FeedbackService _feedbackService;
        public FeedbackController(FeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet]///int id, int exam_id
        public Feedback GetById(int id, int exam_id)
        {
            return _feedbackService.GetById(id, exam_id);
        }

        /// ////////////////////////////////////////////////////////
        // GET api/<FeedbackController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<FeedbackController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<FeedbackController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<FeedbackController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
