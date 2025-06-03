import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../../models/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getStudentById(studentId: number): Observable<Student> {
    return this.http.get<any>(`/Student/${studentId}`);
  }

}


