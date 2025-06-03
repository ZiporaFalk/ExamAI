using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using ExamAI.API.Controllers;
using ExamAI.Core.Services;
namespace ExamAI.API.Controllers
{
    //[Authorize(Policy = "AdminOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class OcrController : ControllerBase
    {
        //private readonly HttpClient _httpClient;
        //private readonly string _googleApiKey = "AIzaSyDvC1ylRFcifTEdiMNcDJt3Ztn2IwvH-Z0";
        //public OcrController(IHttpClientFactory httpClientFactory)
        //{
        //    _httpClient = httpClientFactory.CreateClient();
        //}

        //[HttpPost("analyze-image")]
        //public async Task<IActionResult> AnalyzeImage([FromBody] OcrRequest request)
        //{
        //    var googleApiUrl = $"https://vision.googleapis.com/v1/images:annotate?key={_googleApiKey}";

        //    var googleRequest = new
        //    {
        //        requests = new[]
        //        {
        //        new
        //        {
        //            image = new { content =request.Base64Image },
        //            features = new[] { new { type = "DOCUMENT_TEXT_DETECTION" } }
        //        }
        //    }
        //    };
        //    var jsonContent = new StringContent(JsonSerializer.Serialize(googleRequest), Encoding.UTF8, "application/json");
        //    var response = await _httpClient.PostAsync(googleApiUrl, jsonContent);
        //    var responseString = await response.Content.ReadAsStringAsync();
        //    if (!response.IsSuccessStatusCode)
        //    {
        //        return StatusCode((int)response.StatusCode, responseString);
        //    }
        //    return Ok(JsonDocument.Parse(responseString));
        private readonly IOcrService _ocrService;
        public OcrController(IOcrService ocrService)
        {
            _ocrService = ocrService;
        }

        [HttpPost("analyze-image")]
        public async Task<IActionResult> AnalyzeImage([FromBody] OcrRequest request)
        {
            var result = await _ocrService.AnalyzeImageAsync(request.Base64Image);
            return Ok(result);
        }
    }
}
public class OcrRequest
{
    public string Base64Image { get; set; }
}










//using System.Threading.Tasks;
//using System.Text.Json;

//namespace ExamAI.Core.Interfaces
//{
//    public interface IOcrService
//    {
//        Task<JsonDocument> AnalyzeImageAsync(string base64Image);
//    }
//}

//‫בתאריך יום ב׳, 2 ביוני 2025 ב-22:39 מאת מעוף עריכה דיגטלית <‪maof5728@gmail.com‬‏>:‬


//מעוף עריכה דיגטלית
//22:39(לפני שתי דקות)
//אני

//using Microsoft.AspNetCore.Mvc;
//using System.Threading.Tasks;
//using ExamAI.Core.Models;
//using ExamAI.Core.Interfaces;
//using Microsoft.AspNetCore.Authorization;

//namespace ExamAI.Web.Controllers
//{
//    [Authorize(Policy = "AdminOnly")]
//    [Route("api/[controller]")]
//    [ApiController]
//    public class OcrController : ControllerBase
//    {
//        private readonly IOcrService _ocrService;

//        public OcrController(IOcrService ocrService)
//        {
//            _ocrService = ocrService;
//        }

//        [HttpPost("analyze-image")]
//        public async Task<IActionResult> AnalyzeImage([FromBody] OcrRequest request)
//        {
//            var result = await _ocrService.AnalyzeImageAsync(request.Base64Image);
//            return Ok(result);
//        }
//    }
//}
