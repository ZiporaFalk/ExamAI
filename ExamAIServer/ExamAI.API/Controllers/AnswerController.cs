
using AutoMapper;
using ExamAI.Core.DTOs;
using ExamAI.Core.DTOs.GetDto;
using ExamAI.Core.Models;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly IAnswerService _answerService;
        private readonly IMapper _mapper;

        public AnswerController(IAnswerService answerService, IMapper mapper)
        {
            _answerService = answerService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<GetAnswerDto>> Get([FromQuery] int exam_id)
        {
            var list = await _answerService.GetAllAsync(exam_id);
            return _mapper.Map<IEnumerable<GetAnswerDto>>(list);
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<GetAnswerDto> Get(int id, int exam_id)
        {
            var answer = await _answerService.GetByIdAsync(id, exam_id);
            return _mapper.Map<GetAnswerDto>(answer);
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AnswerDto newAnswerDto)
        {
            var newAnswer = _mapper.Map<Answer>(newAnswerDto);
            await _answerService.PostAsync(newAnswer);
            return Ok("Answer added successfully");
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _answerService.DeleteAsync(id);
            return Ok("Answer deleted successfully");
        }
        //[HttpPut("{id}")]
        //        //public void Put(int id, [FromBody] string value)
        //        //{
        //        //}
    }
}

