using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ExamAI.Core.Services
{
    public interface IOcrService
    {
        Task<JsonDocument> AnalyzeImageAsync(string base64Image);

    }
}
