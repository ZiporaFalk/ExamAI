//using ExamAI.Core.Models;
//using ExamAI.Service.Services;
//using Microsoft.AspNetCore.Mvc;


//namespace ExamAI.API.Controllers
//{

//    [Route("api/[controller]")]
//    [ApiController]
//    public class UserController : ControllerBase
//    {
//        private readonly UserService _userservice;
//        public UserController(UserService userservice)
//        {
//            _userservice = userservice;
//        }

//        [HttpGet]
//        public IEnumerable<User> Get()
//        {
//            return _userservice.GetAll();
//        }

//        [HttpGet("{id}")]
//        public User Get(int id)
//        {
//            return _userservice.GetById(id);
//        }
//        //[HttpPost]
//        //public void Post([FromBody] string value)//הרשמה
//        //{
//        //}

//        //[HttpPut("{id}")]
//        //public void Put(int id, [FromBody] string value)
//        //{

//        //}

//        public void Delete(int id)
//        {
//            _userservice.Delete(id);
//        }
//    }
//}
