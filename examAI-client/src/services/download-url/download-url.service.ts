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
  // async getUrlFile(exam: StudentExamView): Promise<string | undefined> {
  //   try {
  //     const params = {
  //       Url: encodeURIComponent(exam.file_Url_FeedBack!),
  //       IsStudentTest: true
  //     };

  //     const response = await this.http
  //       .get<{ url: string }>(`${this.baseUrl}/ExamUpload/download-url`, { params })
  //       .toPromise();

  //     if (!response?.url) {
  //       console.error('No URL returned from server.');
  //       return;
  //     }
  //     return response.url;
  //   } catch (error) {
  //     console.error('Error downloading feedback:', error);
  //     return;
  //   }
  // }
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


  // async getUrlFile(exam: StudentExamView) {
  //   try {
  //     const params = {
  //       Url: encodeURIComponent(exam.file_Url_FeedBack!),
  //       IsStudentTest: true
  //     };
  //     // const response = await this.getDownloadUrl(params).toPromise();
  //     // const queryParams = new URLSearchParams({
  //     //   Url: params.Url,
  //     //   IsStudentTest: params.IsStudentTest.toString()
  //     // });

  //     const response = this.http.get<{ url: string }>(`${this.baseUrl}/ExamUpload/download-url?`, { params });
  //     if (!response.url) {
  //       console.error('No URL returned from server.');
  //       return;
  //     }
  //     return response.url
  //   }
  //   catch (error) {
  //     console.error('Error downloading feedback:', error);
  //   }
  // }
  // getDownloadUrl(params: { Url: string; IsStudentTest: boolean }): Observable<{ url: string }> {
  //   // const queryParams = new URLSearchParams({
  //   //   Url: params.Url,
  //   //   IsStudentTest: params.IsStudentTest.toString()
  //   // });
  //   return this.http.get<{ url: string }>(`${this.baseUrl}/ExamUpload/download-url?`, { params });
  // }

  // Also update the existing ViewFeedback method to return the URL instead of opening window
  // ViewFeedback(params: { Url: string; IsStudentTest: boolean }): Observable<{ url: string }> {
  //   return this.getDownloadUrl(params);

  // }

}
