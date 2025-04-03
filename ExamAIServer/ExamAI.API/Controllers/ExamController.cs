
using AutoMapper;
using ExamAI.Core.DTOs;
using ExamAI.Core.Models;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly IExamService _examservice;
        private readonly IMapper _mapper;

        public ExamController(IExamService examservice, IMapper mapper)
        {
            _examservice = examservice;
            _mapper = mapper;
        }
        [HttpGet()]
        public async Task<ActionResult<IEnumerable<ExamDto>>> Get()
        {
            var exams = await _examservice.GetAsync();
            if (exams == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<IEnumerable<ExamDto>>(exams));
        }
        //[Authorize(Roles = "Student")]
        [HttpGet("{id}")]
        public async Task<ActionResult<ExamDto>> Get(int id)
        {
            var exam = await _examservice.GetByIdAsync(id);
            if (exam == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<ExamDto>(exam));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ExamDto newexam)
        {
            var exam = _mapper.Map<Exam>(newexam);
            await _examservice.PostAsync(exam);
            return CreatedAtAction(nameof(Get), new { id = exam.Id }, exam);
        }
        //// PUT api/<ExamController>/5
        //        //[HttpPut("{id}")]
        //        //public void Put(int id, [FromBody] string value)
        //        //{
        //        //}

        //        //// DELETE api/<ExamController>/5
        //        //[HttpDelete("{id}")]
        //        //public void Delete(int id)
        //        //{
        //        //}
    }
}
