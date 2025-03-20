using AutoMapper;
using ExamAI.Core.DTOs;
using ExamAI.Core.Models;


namespace ExamAI.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();

            CreateMap<Exam, ExamDto>().ReverseMap();
            CreateMap<Answer, AnswerDto>().ReverseMap();
            CreateMap<Student, StudentDto>().ReverseMap();
            CreateMap<Submission, SubmissionDto>().ReverseMap();
            CreateMap<Manager, ManagerDto>().ReverseMap();


        }
    }
}
