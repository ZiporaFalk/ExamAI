using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.AspNetCore.Mvc;

namespace ExamAI.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("ExamAI מערכת ציונים", "z0548498935@gmail.com"));
            //email.From.Add(MailboxAddress.Parse("your_email@gmail.com"));
            email.To.Add(MailboxAddress.Parse(request.To));
            email.Subject = request.Subject;
            email.Body = new TextPart(MimeKit.Text.TextFormat.Plain) { Text = request.Body };

            //using var smtp = new SmtpClient();
            using var smtp = new MailKit.Net.Smtp.SmtpClient(); 
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync("z0548498935@gmail.com", "ggvq wqid dgmi xlhn"); 
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

            return Ok("Email sent");
        }
    }
    public class EmailRequest
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }

}

