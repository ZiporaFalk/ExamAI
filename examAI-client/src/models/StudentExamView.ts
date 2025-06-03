export interface StudentExamView {
  id?: number;
  subject: string;
  dateExam: string;
  // נלקח מתוך ההגשה:
  score?: number;
  file_Url?: string;
  file_Url_FeedBack?: string;
  hasScannedExam: boolean;
  hasFeedback: boolean;
  status: 'Graded' | 'Pending';
}