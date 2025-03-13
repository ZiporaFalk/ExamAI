//using ExamAI.Core.Models;
//using ExamAI.Core.Repositories;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace ExamAI.Data.Repositories
//{
//    public class FeedbackRepository : IFeedbackRepository
//    {
//        private readonly DataContext _context;

//        public FeedbackRepository(DataContext context)
//        {
//            _context = context;
//        }
//        public Feedback GetById(int id, int exam_id)
//        {
//            return _context.Feedbacks.FirstOrDefault(x => x.Id == id && x.Exam_Id == exam_id);
//        }
//        public void Post(Feedback newFeedback)
//        {
//            _context.Feedbacks.Add(newFeedback);
//        }
//    }
//}
