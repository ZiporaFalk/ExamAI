using ExamAI.Core.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ExamAI.Service.Services
{
    public class OcrService : IOcrService
    {
        private readonly HttpClient _httpClient;
        //private readonly string _googleApiKey = "AIzaSyDvC1ylRFcifTEdiMNcDJt3Ztn2IwvH-Z0";
        private readonly string _googleApiKey;

        public OcrService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _googleApiKey = configuration["Ocr:ApiKey"];
        }

        public async Task<JsonDocument> AnalyzeImageAsync(string base64Image)
        {
            var googleApiUrl = $"https://vision.googleapis.com/v1/images:annotate?key={_googleApiKey}";

            var googleRequest = new
            {
                requests = new[]
                {
                    new
                    {
                     image = new { content = base64Image },
                     features = new[] { new { type = "DOCUMENT_TEXT_DETECTION" } }
                    }
                    }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(googleRequest), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(googleApiUrl, jsonContent);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"OCR request failed: {response.StatusCode} - {responseString}");
            }

            return JsonDocument.Parse(responseString);
        }
    }
}

//using ExamAI.Core.Interfaces;
//using System.Text.Json;
//using System.Text;
//using System.Net.Http;
//using System.Threading.Tasks;

//namespace ExamAI.Service.Ocr
//{
//    public class OcrService : IOcrService
//    {
//        private readonly HttpClient _httpClient;
//        private readonly string _googleApiKey = "AIzaSyDvC1ylRFcifTEdiMNcDJt3Ztn2IwvH-Z0";

//        public OcrService(IHttpClientFactory httpClientFactory)
//        {
//            _httpClient = httpClientFactory.CreateClient();
//        }

//        public async Task<JsonDocument> AnalyzeImageAsync(string base64Image)
//        {
//            var googleApiUrl = $"https://vision.googleapis.com/v1/images:annotate?key={_googleApiKey}";

//            var googleRequest = new
//            {
//                requests = new[]
//                {
//                    new
//                    {
//                        image = new { content = base64Image },
//                        features = new[] { new { type = "DOCUMENT_TEXT_DETECTION" } }
//                    }
//                }
//            };

//            var jsonContent = new StringContent(JsonSerializer.Serialize(googleRequest), Encoding.UTF8, "application/json");
//            var response = await _httpClient.PostAsync(googleApiUrl, jsonContent);
//            var responseString = await response.Content.ReadAsStringAsync();

//            if (!response.IsSuccessStatusCode)
//            {
//                throw new HttpRequestException($"OCR request failed: {response.StatusCode} - {responseString}");
//            }

//            return JsonDocument.Parse(responseString);
//        }
//    }
//}