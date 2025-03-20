
using AutoMapper;
using ExamAI.Core.DTOs;
using ExamAI.Core.Models;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public ManagerController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<ManagerDto>> Get()
        {
            var manager = await _userService.GetManagerAsync();
            var managerDto = _mapper.Map<ManagerDto>(manager);
            return Ok(managerDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ManagerDto managerDto)
        {
            await _userService.UpdateAsync(id, _mapper.Map<Manager>(managerDto));
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }
    }
}
