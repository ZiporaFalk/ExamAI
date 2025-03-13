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
    public class SubmissionController : ControllerBase
    {

        private readonly ISubmissionService _submissionservice;
        private readonly IMapper _mapper;

        public SubmissionController(ISubmissionService submissionservice, IMapper mapper)
        {
            _submissionservice = submissionservice;
            _mapper = mapper;
        }

        [HttpGet]////int id, int exam_id
        public SubmissionDto Get(int id, int exam_id)
        {
            var submission = _submissionservice.Get(id, exam_id);
            return _mapper.Map<SubmissionDto>(submission);
        }

        [HttpGet("{id}")]
        public List<SubmissionDto> Get(int id)
        {
            var list = _submissionservice.GetAllById(id);
            return _mapper.Map<List<SubmissionDto>>(list);
        }

        [HttpPost]
        public void Post([FromBody] SubmissionDto newSubmission)
        {
            _submissionservice.Post(_mapper.Map<Submission>(newSubmission));
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
