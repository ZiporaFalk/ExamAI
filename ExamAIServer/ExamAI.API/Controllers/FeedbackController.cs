//using ExamAI.Core.Models;
//using ExamAI.Core.Services;
//using Microsoft.AspNetCore.Mvc;

//// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

//namespace ExamAI.API.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class FeedbackController : ControllerBase
//    {

//        private readonly IFeedbackService _feedbackService;
//        public FeedbackController(IFeedbackService feedbackService)
//        {
//            _feedbackService = feedbackService;
//        }

//        [HttpGet("{id}")]//int id, int exam_id
//        public Feedback Get(int id, int exam_id)
//        {
//            return _feedbackService.GetById(id, exam_id);
//        }

      
//        //[HttpGet("{id}")]
//        //public string Get(int id)
//        //{
//        //    return "value";
//        //}

//        [HttpPost]
//        public void Post([FromBody] Feedback newFeedback)
//        {
//            _feedbackService.Post(newFeedback);
//        }

//        //[HttpPut("{id}")]
//        //public void Put(int id, [FromBody] string value)
//        //{
//        //}

//        //[HttpDelete("{id}")]
//        //public void Delete(int id)
//        //{
//        //}
//    }
//}
