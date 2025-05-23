﻿using ExamAI.Core.DTOs.GetDto;
using ExamAI.Core.Models;
using ExamAI.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Repositories
{
    public interface IExamRepository
    {
        Task<List<Exam>> GetAsync();

        Task<Exam> GetByIdAsync(int id);
        Task PostAsync(Exam newexam);
        Task<Exam> GetBySubjectAndDateAsync(string dateExam, string subject);

    }
}
