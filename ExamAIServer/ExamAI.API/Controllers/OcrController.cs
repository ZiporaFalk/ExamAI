using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
namespace ExamAI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OcrController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _googleApiKey = "AIzaSyDvC1ylRFcifTEdiMNcDJt3Ztn2IwvH-Z0";
        public OcrController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost("analyze-image")]
        public async Task<IActionResult> AnalyzeImage([FromBody] OcrRequest request)
        {
            var googleApiUrl = $"https://vision.googleapis.com/v1/images:annotate?key={_googleApiKey}";

            var googleRequest = new
            {
                requests = new[]
                {
                new
                {
                    image = new { content =request.Base64Image },
                    features = new[] { new { type = "DOCUMENT_TEXT_DETECTION" } }
                }
            }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(googleRequest), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(googleApiUrl, jsonContent);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, responseString);
            }

            return Ok(JsonDocument.Parse(responseString));
        }
    }
    public class OcrRequest
    {
        public string Base64Image { get; set; }
    }

}





