using ExamAI.Core.Models;
using ExamAI.Core.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Data.Repositories
{
    public class AnswerRepository : IAnswerRepository
    {
        private readonly DataContext _context;

        public AnswerRepository(DataContext context)
        {
            _context = context;
            //_context.Answers.Add(new Answer())
        }
        public Answer GetById(int id, int exam_id)
        {
            //Answer answer= _context.Answers.FirstOrDefault(x => x.Id == id && x.Exam_Id == exam_id);
            //if (answer == null)
            //    return NotFound(); 
            return _context.Answers.FirstOrDefault(x => x.Id == id && x.ExamId == exam_id);
        }
        public void Post(Answer newAnswer)
        {
            _context.Answers.Add(newAnswer);
        }
    }
}
