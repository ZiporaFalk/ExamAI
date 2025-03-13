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
    public class ExamController : ControllerBase
    {

        private readonly IExamService _examservice;
        private readonly IMapper _mapper;

        public ExamController(IExamService examservice, IMapper mapper)
        {
            _examservice = examservice;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public ExamDto Get(int id)
        {
            var exam = _examservice.GetById(id);
            return _mapper.Map<ExamDto>(exam);
        }

        [HttpPost]
        public void Post([FromBody] ExamDto newexam)
        {
            var exam = _mapper.Map<Exam>(newexam);
            _examservice.Post(exam);
        }

        //// PUT api/<ExamController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE api/<ExamController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
