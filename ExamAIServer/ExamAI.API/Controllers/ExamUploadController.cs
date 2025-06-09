using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace ExamAI.API.Controllers
{
    //[Authorize(Policy = "AdminOnly")]
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class ExamUploadController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public ExamUploadController(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:AWS_S3_BUCKET_NAME"];
        }

        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl(string fileName, string subject, string @class, string date, bool IsStudentTest, string contentType)
        {

            if (string.IsNullOrEmpty(fileName))
                return BadRequest("שם הקובץ נדרש");
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = IsStudentTest ? $"exams/Students/{subject}-{date}/{@class}/{fileName}" : $"exams/Results/{subject}/{fileName}",
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(20),
                //ContentType = "application/pdf" // ניתן לשנות לסוג קובץ אחר
                ContentType = contentType
                //ContentType = "image/jpeg"
                //ContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                //ContentType = "application/octet-stream"

            };
            //request.Headers["x-amz-acl"] = "bucket-owner-full-control";

            try
            {
                string url = _s3Client.GetPreSignedURL(request);
                return Ok(new { url });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"Error generating presigned URL: {ex.Message}");
            }
        }

        [HttpGet("download-url")]
        //public async Task<IActionResult> GetDownloadPresignedUrl(string Url, bool IsStudentTest, bool IsDownload = true)
        public async Task<IActionResult> GetDownloadPresignedUrl(string Url, bool IsDownload = true)
        {
            var decodedUrl = Uri.UnescapeDataString(Url);
            var fileName = Path.GetFileName(decodedUrl);
            var encodedFileName = Uri.EscapeDataString(fileName);

            string disposition = IsDownload
                ? $"attachment; filename=\"fallback.jpg\"; filename*=UTF-8''{encodedFileName}"
                : "inline";

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                //Key = Url,
                Key = decodedUrl,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(20),
                ResponseHeaderOverrides = new ResponseHeaderOverrides
                {
                    //ContentDisposition = "attachment"
                    //ContentDisposition = "inline"
                    ContentDisposition = disposition
                }
            };

            try
            {
                string url = _s3Client.GetPreSignedURL(request);
                return Ok(new { url });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"Error generating download URL: {ex.Message}");
            }
        }
    }
}

