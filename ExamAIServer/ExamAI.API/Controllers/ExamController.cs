﻿
using AutoMapper;
using ExamAI.Core.DTOs;
using ExamAI.Core.DTOs.GetDto;
using ExamAI.Core.Models;
using ExamAI.Core.Services;
using ExamAI.Service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ExamAI.API.Controllers
{
    //[Authorize(Policy = "StudentOrAdmin")]
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
        public async Task<ActionResult<IEnumerable<GetExamDto>>> Get()
        {
            var exams = await _examservice.GetAsync();
            if (exams == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<IEnumerable<GetExamDto>>(exams));
        }
        //[Authorize(Roles = "Student")]
        [HttpGet("{id}")]
        public async Task<ActionResult<GetExamDto>> Get(int id)
        {
            var exam = await _examservice.GetByIdAsync(id);
            if (exam == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<GetExamDto>(exam));
        }
        [HttpGet("BySubjectAndDate/{dateExam}/{subject}")]
        public async Task<ActionResult<GetExamDto>> Get(string dateExam, string subject)
        {
            var exam = await _examservice.GetBySubjectAndDateAsync(dateExam, subject);
            var examDto = _mapper.Map<GetExamDto>(exam);
            return Ok(examDto);
        }
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ExamDto newexam)
        {
            var exam = _mapper.Map<Exam>(newexam);
            await _examservice.PostAsync(exam);
            return CreatedAtAction(nameof(Get), new { id = exam.Id }, exam);
        }
   
    }
}
