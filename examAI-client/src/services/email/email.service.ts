// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class EmailService {

//   constructor() { }


// }
// services/email.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailRequest } from '../../models/EmailRequest';
// import { EmailRequest } from '../models/EmailRequest';

@Injectable({
  providedIn: 'root',
})
export class EmailService { 
  constructor(private http: HttpClient) { }

  sendEmail(request: EmailRequest): Observable<any> {
    return this.http.post(`/Email/send`, request);
  }
}
