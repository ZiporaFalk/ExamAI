
using AutoMapper;
using ExamAI.Core.DTOs;
using ExamAI.Core.DTOs.GetDto;
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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetSubmissionDto>>> GetAllAsync()
        {
            var list = await _submissionservice.GetAllAsync();

            return Ok(_mapper.Map<IEnumerable<GetSubmissionDto>>(list));
        }

        [HttpGet("{student_id}/{exam_id}")]
        public async Task<ActionResult<GetSubmissionDto>> Get(int student_id, int exam_id)
        {
            var submission = await _submissionservice.GetAsync(student_id, exam_id);
            Console.WriteLine(submission);
            if (submission == null)
            {
                return NotFound($"Submission not found for student {student_id} and exam {exam_id}");
            }
            return Ok(_mapper.Map<GetSubmissionDto>(submission));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<List<GetSubmissionDto>>> Get(int id)
        {
            var list = await _submissionservice.GetAllByIdAsync(id);
            return Ok(_mapper.Map<List<GetSubmissionDto>>(list));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] SubmissionDto newSubmission)
        {
            var submission = _mapper.Map<Submission>(newSubmission);
            await _submissionservice.PostAsync(submission);
            return CreatedAtAction(nameof(Get), new { id = submission.Id }, submission);
        }
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] SubmissionDto newSubmission)
        //{
        //}

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] SubmissionDto updatedSubmission)
        {
            var existingSubmission = await _submissionservice.GetByIdAsync(id);
            if (existingSubmission == null)
            {
                return NotFound();
            }
            Console.WriteLine(existingSubmission.Id + "iiiiiiiiiiiiiiiiiiiii");

            if (id != existingSubmission.Id)
            {
                return BadRequest("ID mismatch");
            }

            //_mapper.Map(updatedSubmission, existingSubmission);
            var submission = _mapper.Map<Submission>(updatedSubmission);
            await _submissionservice.UpdateAsync(id, submission);

            return NoContent();
        }
        //[HttpPut("score/{id}")]
        //public async Task<IActionResult> Put(int studentId, int examId, int newScore)
        //{
        //    if (Get(studentId, examId) == null) return NotFound();
        //    await _submissionservice.UpdateScoreAsync(studentId, examId, newScore);

        //    return NoContent();
        //}

        //[HttpPut("urls/{id}")]
        //public async Task<IActionResult> Put(int studentId, int examId, string urlFile, string urlFeedback)
        //{
        //    if (Get(studentId, examId) == null) return NotFound();
        //    await _submissionservice.UpdateUrlsAsync(studentId, examId, urlFile, urlFeedback);
        //    return NoContent();
        //}

    }
}
