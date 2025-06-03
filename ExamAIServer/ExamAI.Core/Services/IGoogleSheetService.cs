using ExamAI.Core.DTOs;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Core.Services
{
    public interface IGoogleSheetService
    {

        Task<SheetsService> GetSheetServiceAsync();

       Task<List<StudentDto>> GetStudentsAsync();
       
        Task<string?> FindStudentEmailAsync(string name, string className);
    
        Task<bool> IsEmailExistsAsync(string email);
   


    }
}
