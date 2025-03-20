
using AutoMapper;
using ExamAI.Core.DTOs;
using ExamAI.Core.Models;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        [HttpGet] // int id, int exam_id
        public async Task<ActionResult<SubmissionDto>> Get(int id, int exam_id)
        {
            var submission = await _submissionservice.GetAsync(id, exam_id);
            if (submission == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<SubmissionDto>(submission));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<List<SubmissionDto>>> Get(int id)
        {
            var list = await _submissionservice.GetAllByIdAsync(id);
            return Ok(_mapper.Map<List<SubmissionDto>>(list));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] SubmissionDto newSubmission)
        {
            var submission = _mapper.Map<Submission>(newSubmission);
            await _submissionservice.PostAsync(submission);
            return CreatedAtAction(nameof(Get), new { id = submission.Id }, submission);
        }
        //[HttpPut("{id}")]
        //        //public void Put(int id, [FromBody] string value)
        //        //{
        //        //}

        //        //[HttpDelete("{id}")]
        //        //public void Delete(int id)
        //        //{
        //        //}
    }
}
