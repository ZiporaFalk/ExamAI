using AutoMapper;
using ExamAI.Core.DTOs;
using ExamAI.Core.DTOs.GetDto;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace ExamAI.API.Controllers
{
    //[Authorize(Roles = "Student")]
    [Authorize(Policy = "StudentOrAdmin")]

    //[Authorize(Policy = "StudentOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class DashBoardController : ControllerBase
    {

        private readonly IDashBoardService _dashboardService;
        private readonly IMapper _mapper;

        public DashBoardController(IDashBoardService dashboardService, IMapper mapper)
        {
            _dashboardService = dashboardService;
            _mapper = mapper;
        }
        [HttpGet("class-avg")]
        public async Task<ActionResult<double>> GetClassAvgAsync(string _class = null, string sub = null)
        {
            return Ok(await _dashboardService.GetClassAvgAsync(_class, sub));
        }

        // ממוצע לתלמיד בודד
        [HttpGet("student-avg/{studentId}")]
        public async Task<ActionResult<double>> GetAvgOfStudentAsync(int studentId)
        {
            return Ok(await _dashboardService.GetAvgOfStudentAsync(studentId));
        }

        // אחוז מעבר לכיתה (ולאופציה לפי מקצוע)
        [HttpGet("pass-rate")]
        public async Task<ActionResult<double>> GetPassRateAsync(string _class = null, string sub = null)
        {
            return Ok(await _dashboardService.GetPassRateAsync(_class, sub));
        }
        // כל ההגשות לפי כיתה ומקצוע
        [HttpGet("exams")]
        public async Task<ActionResult<List<GetSubmissionDto>>> GetExamBySubAndClassAsync(string _class = null, string sub = null)
        {
            var submissions = await _dashboardService.GetExamBySubAndClassAsync(_class, sub);

            return Ok(_mapper.Map<List<GetSubmissionDto>>(submissions));
        }

    }

}

