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
    public class AnswerController : ControllerBase
    {

        private readonly IAnswerService _answerservice;
        private readonly IMapper _mapper;

        public AnswerController(IAnswerService answerservice, IMapper mapper)
        {
            _answerservice = answerservice;
            _mapper = mapper;
        }

        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //var matchmakerDto = _mapper.Map<MatchmakerDto>(matchmaker);

        [HttpGet("{id}")]
        public AnswerDto Get(int id, int exam_id)
        {
            var answer = _answerservice.GetById(id, exam_id);
            return _mapper.Map<AnswerDto>(answer);
        }

        [HttpPost]
        public void Post([FromBody] AnswerDto newAnswerDto)
        {
            var newAnswer = _mapper.Map<Answer>(newAnswerDto);
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
