import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Student } from '../../models/Student';
import { StudentService } from '../student/student.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  userId:number
}

interface GoogleJwtPayload {
  id: number;
  name: string;
  email: string;
  picture: string;
  // sub: string;
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
        const decodedToken: any = jwtDecode(res.token);
        console.log(decodedToken);
        const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
       const name=decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
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
        // this.studentService.getStudentById(userId).subscribe((student: Student) => {
        //   const profile = {
        //     id:userId,
        //     name: student.name,
        //     email: student.email||'',
        //     picture: '/images/background.jpg', // אין תמונה בלוגין רגיל
        //   };
        //   localStorage.setItem('profile', JSON.stringify(profile));
        //   this.userProfileSubject.next(profile);
        // });

        // return this.studentService.getStudentById(userId).pipe(
        //   tap((student: Student) => {
        //     const profile = {
        //       id: userId,
        //       name: student.name,
        //       email: student.email || '',
        //       picture: '/images/background.jpg',
        //     };
        //     console.log(profile);
        //     localStorage.setItem('profile', JSON.stringify(profile));
        //     this.userProfileSubject.next(profile);
        //   })
        // );
      })
    );
  }


//   registerStudent(data: any): Observable<any> {
// console.log(data);

// this.http.get(`/GoogleSheets/email?name=${encodeURIComponent(data.name)}&className=${encodeURIComponent(data.class)}`)
//   .pipe(
//     catchError(error => {
//       if (error.status === 404) {
//         // הצגת שגיאה או עצירת תהליך
//         console.error('Student not found in Google Sheets');
//         return throwError(() => new Error('Student not found')); // מונע המשך שרשרת
//       }
//       return throwError(() => error); // טיפול בשגיאות אחרות
//     })
//   )
//   .subscribe({
//     next: (response) => {
//       // אם הצליח, ממשיכים כרגיל
//       console.log('Success:', response);

//       return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/register`, data).pipe(
//         tap(res => { 
//           const decodedToken: any = jwtDecode(res.token);
//           console.log(decodedToken);
//           const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
//           console.log(userId);
//           console.log("userId");
          
//           if (!userId) {
//             console.error('User ID not found in token');
//             return;
//           }
//           localStorage.setItem("userId", userId);
//           this.studentService.getStudentById(userId).subscribe((student: Student) => {
//             const profile = {
//               id:student.id||0,
//               name: student.name,
//               email: student.email||'',
//               picture: '/images/background.jpg', // אין תמונה בלוגין רגיל
//             };
//             localStorage.setItem('profile', JSON.stringify(profile));
//             this.userProfileSubject.next(profile);
//           });
//           localStorage.setItem("token", res.token);
//           this.isLoggedInSubject.next(true);
//         })
//       );
//     },
//     error: (err) => {
//       // כאן תוכל לטפל בשגיאה ברמת subscribe אם תרצה
//       alert(err.message); // או הצגת toast
//     }
//   });
// }
// registerStudent(data: any): Observable<any> {
//   console.log(data);
//   return this.http.get(`/GoogleSheets/email?name=${encodeURIComponent(data.name)}&className=${encodeURIComponent(data.class)}`)
//     .pipe(
//       catchError(error => {
//         if (error.status === 404) {
//           return throwError(() => new Error('Student not found in Google Sheets'));
//         }
//         return throwError(() => error);
//       }),
//       switchMap(() => 
//         this.http.post<LoginResponse>(`${this.baseUrl}/Auth/register`, data).pipe(
//           tap(res => {
//             const decodedToken: any = jwtDecode(res.token);
//             const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
//             if (!userId) {
//               console.error('User ID not found in token');
//               return;
//             }
//             localStorage.setItem("userId", userId);
//             localStorage.setItem("token", res.token);
//             this.isLoggedInSubject.next(true);

//             this.studentService.getStudentById(userId).subscribe((student: Student) => {
//               const profile = {
//                 id: student.id || 0,
//                 name: student.name,
//                 email: student.email || '',
//                 picture: '/images/background.jpg',
//               };
//               localStorage.setItem('profile', JSON.stringify(profile));
//               this.userProfileSubject.next(profile);
//             });
//           })
//         )
//       )
//     );
// }
// checkStudentExistsInGoogleSheets(email:string): Observable<boolean> {

//   // const url = `${this.baseUrl}/GoogleSheets/email?name=${encodeURIComponent(data.name)}&className=${encodeURIComponent(data.class)}`;
//   // `${this.baseUrl}/GoogleSheets/email-exists?email=${encodeURIComponent(email)}`

//   const url = `${this.baseUrl}/GoogleSheets/email-exists?email=${encodeURIComponent(email)}`

// }

// registerStudent(data: any): Observable<any> {
//   //לבדוק רק לפי מייל!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//   const url = `${this.baseUrl}/GoogleSheets/email?name=${encodeURIComponent(data.name)}&className=${encodeURIComponent(data.class)}`;
//   console.log(data);

//   return this.http.get(url).pipe(
//     // אם Google Sheets מחזיר 404 – עוצרים הכל עם שגיאה
//     catchError(error => {
//       if (error.status === 404) {
//         return throwError(() => ({
//           status: 404,
//           message: 'Student not found in the System'
//         }));}
//       return throwError(() => error); // שגיאות אחרות
//     }),

//     // אם הצליח – מבצעים את הרישום בשרת שלנו
//     switchMap(() =>
//     this.http.post<LoginResponse>(`${this.baseUrl}/Auth/register`, data)),
//     // אחרי ההרשמה – מפענחים את ה־JWT ושומרים מידע
//     switchMap((res) => {
//       const decodedToken: any = jwtDecode(res.token);
//       const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

//       if (!userId) {
//         return throwError(() => new Error('User ID not found in token'));
//       }
//       localStorage.setItem("userId", userId);
//       localStorage.setItem("token", res.token);
//       this.isLoggedInSubject.next(true);

//       // מביאים את פרטי הסטודנט מהשרת
//       return this.studentService.getStudentById(userId).pipe(
//         tap((student: Student) => {
//           const profile = {
//             id: student.id || 0,
//             name: student.name,
//             email: student.email || '',
//             picture: '/images/background.jpg',
//           };
//           localStorage.setItem('profile', JSON.stringify(profile));
//           this.userProfileSubject.next(profile);
//         })
//       );
//     })
//   );
// }
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


// ..................
// googleLogin(Token: string): Observable<LoginResponse> {
//   const decodedToken: GoogleJwtPayload = jwtDecode(Token);
//   const email = decodedToken.email;

//   return this.http.get<{ exists: boolean }>(
//     `${this.baseUrl}/GoogleSheets/email-exists?email=${encodeURIComponent(email)}`
//   ).pipe(
//     switchMap(response => {
//       if (!response.exists) {
//         // זריקת שגיאה כדי לעצור את ההתחברות
//         return throwError(() => new Error('This email is not authorized to log in.'));
//       }
//       // המשך להתחברות רגילה
//       const profile = {
//         id: decodedToken.id,
//         name: decodedToken.name,
//         email: decodedToken.email,
//         picture: decodedToken.picture
//       };
//       localStorage.setItem('profile', JSON.stringify({ profile }));
//       this.userProfileSubject.next(profile);

//       return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/google`, { Token }).pipe(
//         tap(res => {
//           localStorage.setItem("token", res.token);
//           localStorage.setItem("userId", JSON.stringify(decodedToken.id!));
//           this.isLoggedInSubject.next(true);
//         })
//       );
//     })
//   );
// }
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

  // googleLogin(Token: string): Observable<LoginResponse> {
    
  //   const decodedToken: GoogleJwtPayload = jwtDecode(Token);
  //   ////////////////פה לעשות אותו בידהק אם המייל נמצא, אבל כאן נבדוק על מייל ומשהו אחר כי אין כיתה
  //   ////אולי נשנה שיבדוק לפי מייל ומשהו אחר
  //   ////רק אם נמצא בגוגל שיט ניתן להמשיך להתחבר כמו הרשמה!
  //   const profile = {
  //     id:decodedToken.id,
  //     name: decodedToken.name,
  //     email: decodedToken.email,
  //     picture: decodedToken.picture
  //   };
  //   localStorage.setItem('profile', JSON.stringify({profile}));
  //   this.userProfileSubject.next(profile);

  //   return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/google`, { Token }).pipe(
  //     tap(res => {
  //       const decodedToken: GoogleJwtPayload = jwtDecode(Token)
  //       localStorage.setItem("token", res.token);
  //       localStorage.setItem("userId", JSON.stringify(decodedToken.id!));
  //       this.isLoggedInSubject.next(true);
  //     })
  //   );
  // }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    this.isLoggedInSubject.next(false);
    this.userProfileSubject.next({
      id:0,
      name: 'לא מחובר',
      email: '',
      picture: '/images/background.jpg',
    });

  }
  // getUserProfileFromStorage(): GoogleJwtPayload | null {
  //   const storedProfile = localStorage.getItem('userProfile');
  //   return storedProfile ? JSON.parse(storedProfile) : null;
  // }
  
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  private hasToken(): boolean {
    return !!localStorage.getItem("token");
  }
  
  clearUserProfile()
  {
    this.userProfileSubject.next({
      id:0,
      name: 'לא מחובר',
      email: '',
      picture: '/images/background.jpg',
    });
  }
}


// private baseUrl = 'https://localhost:50397/api';
// private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
// public isLoggedIn$ = this.isLoggedInSubject.asObservable();
// private userProfileSubject = new BehaviorSubject<GoogleJwtPayload | null>(null);
// userProfile$ = this.userProfileSubject.asObservable();
// constructor(private http: HttpClient,private studentService:StudentService) {}

// login(email: string, password: string): Observable<LoginResponse> {
//   return this.http.post<LoginResponse>(`${this.baseUrl}/Auth`, { email, password }).pipe(
//     tap(res => {
//       const decodedToken: any = jwtDecode(res.token);
//       localStorage.setItem("userId",decodedToken.id);
//       this.studentService.getStudentById(decodedToken.id).subscribe((student: Student) => {
//         const profile:GoogleJwtPayload= {
//           name: student.firstName + ' ' + student.lastName,
//           email: student.email,
//           picture: null // אין תמונה בלוגין רגיל
//           ,
//           id: '',
//           sub: ''
//         };
//         localStorage.setItem('profile', JSON.stringify(profile));
//         this.userProfileSubject.next(profile);

//       });
//       localStorage.setItem("token", res.token);
//       this.isLoggedInSubject.next(true);
//     })
//   );
// }

// registerStudent(data: any): Observable<any> {
//   return this.http.post(`${this.baseUrl}/Auth/register-student`, data);
// }

// googleLogin(idToken: string): Observable<LoginResponse> {
//   const decodedToken: GoogleJwtPayload = jwtDecode(idToken);
  
//   console.log(localStorage.getItem('profile'));
//   return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/google-login`, { idToken }).pipe(
//     tap(res => {
//       const decodedToken: GoogleJwtPayload = jwtDecode(idToken)
//       localStorage.setItem("token", res.token);
//       localStorage.setItem("userId",decodedToken.id);
//       this.isLoggedInSubject.next(true);
//       localStorage.setItem('profile', JSON.stringify({
//         name: decodedToken.name,
//         email: decodedToken.email,
//         picture: decodedToken.picture
//       }));
//       // window.location.reload();
//       this.userProfileSubject.next(decodedToken);

//     })
//   );
// }

// logout(): void {
//   localStorage.removeItem("token");
//   localStorage.removeItem("profile");
//   this.isLoggedInSubject.next(false);
// }

// getToken(): string | null {
//   return localStorage.getItem("token");
// }

// private hasToken(): boolean {
//   return !!localStorage.getItem("token");
// }
// clearUserProfile()
// {
//   // this.userProfile$ = of(null);
//   this.userProfileSubject.next(null);

// }