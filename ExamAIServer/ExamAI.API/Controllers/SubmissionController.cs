using ExamAI.Core.Models;
using ExamAI.Service.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {

        private readonly SubmissionService _submissionservice;
        public SubmissionController(SubmissionService submissionservice)
        {
            _submissionservice = submissionservice;
        }

        [HttpGet]////int id, int exam_id
        public Submission Get(int id, int exam_id)
        {
            return _submissionservice.Get(id, exam_id);
        }

        [HttpGet("{id}")] 
        public List<Submission> Get(int id)
        {
            return _submissionservice.GetAllById(id);
        }

        [HttpPost]
        public void Post([FromBody] Submission newSubmission)
        {
            _submissionservice.Post(newSubmission);
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
