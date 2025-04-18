﻿
using AutoMapper;
using ExamAI.Core.DTOs;
using ExamAI.Core.Models;
using ExamAI.Core.Services;
using ExamAI.Service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public StudentController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudents()
        {
            var list = await _userService.GetAllStudentsAsync();
            return Ok(_mapper.Map<IEnumerable<StudentDto>>(list));
        }
        [HttpGet("ByClass")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudentsByClasss(string class_id)
        {
            var list = await _userService.GetStudentsByClassAsync(class_id);
            return Ok(_mapper.Map<IEnumerable<StudentDto>>(list));
        }

        [HttpGet("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<StudentDto>> Get(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user is Student)
            {
                return Ok(_mapper.Map<StudentDto>(user));
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] StudentDto studentDto)
        {
            if (studentDto == null)
            {
                return BadRequest("Invalid student data.");
            }

            var student = _mapper.Map<Student>(studentDto);
            var createdStudent = await _userService.AddStudentAsync(student);

            if (createdStudent == null)
            {
                return BadRequest("Failed to create student.");
            }

            var createdStudentDto = _mapper.Map<StudentDto>(createdStudent);
            return CreatedAtAction(nameof(Get), new { id = createdStudentDto.Id }, createdStudentDto);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, StudentDto studentDto)
        {
       
            if (studentDto == null)
                return BadRequest("Invalid student data.");

            var student = _mapper.Map<Student>(studentDto);
            var updatedStudent = await _userService.UpdateAsync(id, student);

            if (updatedStudent == null)
                return NotFound("Student not found.");

            return Ok(_mapper.Map<StudentDto>(updatedStudent));

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }
    }
}
