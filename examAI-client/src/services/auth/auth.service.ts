import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Student } from '../../models/Student';
import { StudentService } from '../student/student.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface LoginResponse {
  token: string;
  userId: number
}

interface GoogleJwtPayload {
  id: number;
  name: string;
  email: string;
  picture: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private userProfileSubject = new BehaviorSubject<GoogleJwtPayload | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient, private studentService: StudentService) {
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      this.userProfileSubject.next(JSON.parse(storedProfile));
    }
    console.log("kjihj");
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`/Auth/login`, { email, password }).pipe(
      tap(res => {
        if (!res || !res.token) {
          console.error('No token in response:', res);
          return;
        }
        const decodedToken: any = jwtDecode(res.token);
        console.log(decodedToken);
        const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
        console.log(userId);
        console.log("userId");

        if (!userId) {
          console.error('User ID not found in token');
          return;
        }
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", res.token);
        this.isLoggedInSubject.next(true);
        const profile = {
          id: userId,
          name: name,
          email: email || '',
          picture: '/images/background.jpg',
        };
        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfileSubject.next(profile);
      })
    );
  }


  registerStudent(data: any): Observable<any> {
    return this.http.post<LoginResponse>(`/Auth/register`, data).pipe(
      catchError(error => {
        // טיפול בשגיאה מסוג 400 עם הודעה מותאמת מהשרת
        if (error.status === 400) {
          console.log(error);

          const message = error.error || 'Registration failed';
          return throwError(() => ({
            status: 400,
            message
          }));
        }
        // טיפול בשגיאות אחרות
        return throwError(() => error);
      }),
      switchMap((res) => {
        const decodedToken: any = jwtDecode(res.token);
        const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        if (!userId) {
          return throwError(() => new Error('User ID not found in token'));
        }

        this.isLoggedInSubject.next(true);

        return this.studentService.getStudentById(userId).pipe(
          tap((student: Student) => {
            const profile = {
              id: student.id || 0,
              name: student.name,
              email: student.email || '',
              picture: '/images/background.jpg',
            };
            localStorage.setItem('profile', JSON.stringify(profile));
            localStorage.setItem("token", res.token);
            localStorage.setItem("userId", userId);
            this.userProfileSubject.next(profile);
          })
        );
      })
    );
  }

  googleLogin(Token: string): Observable<LoginResponse> {
    const decodedToken: GoogleJwtPayload = jwtDecode(Token);

    return this.http.post<LoginResponse>(`/Auth/google`, { Token }).pipe(
      catchError(error => {
        if (error.status === 400) {
          const message = error.error?.message || 'Google login failed';
          return throwError(() => ({
            status: 400,
            message
          }));
        }
        return throwError(() => error);
      }),
      tap(res => {
        console.log(res);

        // רק אם הצליח – לשמור פרופיל וטוקן
        const profile = {
          id: res.userId,
          name: decodedToken.name,
          email: decodedToken.email,
          picture: decodedToken.picture
        };
        localStorage.setItem('profile', JSON.stringify(profile));
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", JSON.stringify(res.userId));
        this.userProfileSubject.next(profile);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    this.isLoggedInSubject.next(false);
    this.userProfileSubject.next({
      id: 0,
      name: 'לא מחובר',
      email: '',
      picture: '/images/background.jpg',
    });

  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  private hasToken(): boolean {
    return !!localStorage.getItem("token");
  }

  clearUserProfile() {
    this.userProfileSubject.next({
      id: 0,
      name: 'לא מחובר',
      email: '',
      picture: '/images/background.jpg',
    });
  }
}