import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exam } from '../../models/Exam';
import { StudentExamView } from '../../models/StudentExamView';

@Injectable({
  providedIn: 'root'
})
export class DownloadUrlService {

  constructor(private http: HttpClient) { }

  getUrlFile(exam: StudentExamView, IsFeedback: boolean, IsDownload: boolean): Observable<{ url: string }> {
    console.log("אני פה");
    const url = IsFeedback ? exam.file_Url_FeedBack! : exam.file_Url!
    const params = {
      // Url: encodeURIComponent(exam.file_Url_FeedBack!),
      // Url: encodeURIComponent(exam.file_Url!),
      Url: encodeURIComponent(url),
      IsStudentTest: true,
      IsDownload: IsDownload,
    };
    return this.http.get<{ url: string }>(`/ExamUpload/download-url`, { params });
  }
}