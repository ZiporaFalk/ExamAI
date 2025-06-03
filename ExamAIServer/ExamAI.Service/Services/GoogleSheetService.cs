using ExamAI.Core.DTOs;
using ExamAI.Core.Services;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class GoogleSheetService : IGoogleSheetService
    {
        private readonly string[] Scopes = { SheetsService.Scope.SpreadsheetsReadonly };
        private readonly string ApplicationName = "ExamAI";
        private readonly string SheetRange = "examai_detailsstudents";// שם הטאב בגליון
        private readonly string _spreadsheetId;
        private readonly string _credentialsJson;


        public GoogleSheetService(IConfiguration configuration)
        {
            _spreadsheetId = configuration["GoogleSheets:SpreadsheetId"];
            _credentialsJson = configuration["GoogleSheets:CredentialsJson"]; // מחרוזת JSON מלאה

        }
        public async Task<SheetsService> GetSheetServiceAsync()
        {
            GoogleCredential credential;
            using (var stream = new MemoryStream(Encoding.UTF8.GetBytes(_credentialsJson)))
            {
                credential = GoogleCredential.FromStream(stream).CreateScoped(Scopes);
            }

            return new SheetsService(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });
        }

        public async Task<List<StudentDto>> GetStudentsAsync()
        {
            var service = await GetSheetServiceAsync();
            var request = service.Spreadsheets.Values.Get(_spreadsheetId, SheetRange);
            ValueRange response = await request.ExecuteAsync();
            IList<IList<object>> values = response.Values;

            var students = new List<StudentDto>();

            if (values != null && values.Count > 1)
            {
                for (int i = 1; i < values.Count; i++) // שורה ראשונה היא כותרות
                {
                    var row = values[i];
                    if (row.Count < 3 || string.IsNullOrWhiteSpace(row[0]?.ToString()))
                        continue; // דלג על שורות ריקות

                    students.Add(new StudentDto
                    {
                        Name = row[0]?.ToString() ?? "",
                        studentClass = row[1]?.ToString() ?? "",
                        Email = row[2]?.ToString() ?? "",
                    });
                }
            }

            return students;
        }

        public async Task<string?> FindStudentEmailAsync(string name, string className)
        {
            var students = await GetStudentsAsync();

            var student = students.FirstOrDefault(s =>
                string.Equals(s.Name, name, StringComparison.OrdinalIgnoreCase) &&
                string.Equals(s.studentClass, className, StringComparison.OrdinalIgnoreCase));
            return student?.Email;
        }
        public async Task<bool> IsEmailExistsAsync(string email)
        {
            var students = await GetStudentsAsync();
            return students.Any(s =>
                string.Equals(s.Email?.Trim(), email?.Trim(), StringComparison.OrdinalIgnoreCase));
        }
    }
}
