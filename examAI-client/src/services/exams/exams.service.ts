import { Injectable } from '@angular/core';
import { Exam } from '../../models/Exam';
import { BehaviorSubject, Observable, forkJoin, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StudentExamView } from '../../models/StudentExamView';
import { Submission } from '../../models/Submission';
import { Student } from '../../models/Student';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {

  private examsSubject: BehaviorSubject<StudentExamView[]> = new BehaviorSubject<StudentExamView[]>([]);
  public exams$: Observable<StudentExamView[]>;

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.exams$ = this.examsSubject.asObservable();
  }

  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`/Exam`);
  }

  getAllSubmissions(): Observable<Submission[]> {
    return this.http.get<Submission[]>(`/Submission`);
  }

  getStudentSubmissions(studentId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(`/Submission/student/${studentId}`);
  }

  // פונקציה לאיחוד מבחנים עם הגשות של תלמיד ספציפי
  buildStudentExamView(exams: Exam[], submissions: Submission[]): StudentExamView[] {
    return exams.map((exam) => {
      const submission = submissions.find((s) => s.examId === exam.id);
      return {
        id: exam.id,
        subject: exam.subject,
        dateExam: exam.dateExam,
        score: submission?.score,
        file_Url: submission?.file_Url,
        file_Url_FeedBack: submission?.file_Url_FeedBack,
        hasScannedExam: !!submission?.file_Url,
        hasFeedback: !!submission?.file_Url_FeedBack,
        status: submission ? 'Graded' : 'Pending',
      };
    });
  }

  loadStudentExams(studentId: number): void {
    forkJoin({
      exams: this.getExams(),
      submissions: this.getStudentSubmissions(studentId),
    }).pipe(
      map(({ exams, submissions }) => this.buildStudentExamView(exams, submissions))
    ).subscribe({
      next: (studentExams) => {
        this.examsSubject.next(studentExams);
      },
      error: (err) => console.error('Failed to load exams:', err),
    });
  }

  getStudentById(studentId: number): Observable<Student> {
    return this.http.get<Student>(`/Student/${studentId}`);
  }
  
}
