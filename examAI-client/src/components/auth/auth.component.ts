
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { GoogleSigninComponent } from "../google-signin/google-signin.component";
 interface NotificationMessage {
  text: string;
  type: 'success' | 'error';
  visible: boolean;
}
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    GoogleSigninComponent
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  authForm: FormGroup;
  isSignInMode = true;
  hide = true;
  message: string = '';
  showSuccessAlert = false;

  notification: NotificationMessage = {
    text: '',
    type: 'success',
    visible: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    // private socialAuthService: SocialAuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      name: [''],
      grade: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.setValidators();
  }

  private setValidators(): void {
    if (!this.isSignInMode) {
      this.authForm.get('name')?.setValidators([Validators.required]);
      this.authForm.get('grade')?.setValidators([Validators.required]);
    } else {
      this.authForm.get('name')?.clearValidators();
      this.authForm.get('grade')?.clearValidators();
    }
    this.authForm.get('name')?.updateValueAndValidity();
    this.authForm.get('grade')?.updateValueAndValidity();
  }

  setMode(signIn: boolean) {
    this.isSignInMode = signIn;
    this.setValidators();
    
  }
  // <!-- ............................................................................................ -->
  // private showSuccessMessage(text: string) {
  //   this.message = text;
  //   this.messageType = 'success';
  //   this.showSuccessAlert = true;
    
  //   // הסר אוטומטית לאחר 4 שניות
  //   setTimeout(() => {
  //     this.closeSuccessAlert();
  //   }, 4000);
  // }

  // // פונקציה להצגת הודעת שגיאה
  // private showErrorMessage(text: string) {
  //   this.message = text;
  //   this.messageType = 'error';
  //   this.showSuccessAlert = false;
    
  //   // הסר הודעת שגיאה לאחר 5 שניות
  //   setTimeout(() => {
  //     this.clearMessages();
  //   }, 5000);
  // }

  // // פונקציה לסגירת alert הצלחה
  // closeSuccessAlert() {
  //   this.showSuccessAlert = false;
  //   this.clearMessages();
  // }

  // // פונקציה לניקוי הודעות
  // private clearMessages() {
  //   this.message = '';
  //   this.showSuccessAlert = false;
  // }
  
  // <!-- ............................................................................................ -->
  closeModal() {
    this.router.navigate(['/']); // או לכל נתיב שתרצי
  }

  onSubmit() {
    this.message = ''; 
    if (this.authForm.invalid) return;
    console.log("onSubmit2");
    const { name, grade, email, password } = this.authForm.value;
    if (this.isSignInMode) {
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log("התחברת בהצלחה")
          this.message = 'login successful'
          this.showNotification(  this.message,'success');
        },
        error: (err) => {
          let errorMessage = '';
          if (err.status === 400) {
            errorMessage = "Email or password is incorrect";
          } else if (err.status === 401) {
            errorMessage = "User not found, please register";
          } else {
            errorMessage = "Oops, something went wrong";
          }
          this.showNotification(errorMessage, 'error');
          console.error("שגיאה בהתחברות", err);
        }
      });
    } else {
      const studentData = { name, class: grade, email, password, role: "Student" };
      this.authService.registerStudent(studentData).subscribe({
        next: () => {
          console.log("נרשמת בהצלחה"),
          this.message = 'register successful'
          // this.messageType = 'success'
          // this.router.navigate(['/home']); // או לכל נתיב שתרצי
          // ....................................................
          // הצג הודעת הצלחה
          this.showNotification(this.message, 'success');
          // המתן 2 שניות לפני המעבר כדי שהמשתמש יראה את ההודעה
          // setTimeout(() => {
          //   this.router.navigate(['/home']);
          // }, 2000);
        },
        error: (err) => {
          let errorMessage = '';
          if (err.status == 404) {
            errorMessage=   err.message || "Student not found";
          }
          if (err.status == 400) {
            // errorMessage = "Error, This email does not exist on Google Sheets, you cannot register with the system!";
            errorMessage=   err.message || "Error in register";
          } else {
            errorMessage = "Oops, something went wrong";
            console.log(err.error);
            
          }          
          this.showNotification(errorMessage, 'error');
          console.error("שגיאה בהרשמה", err);
     } });
    }
  }
  showNotification(message: string, type: 'success' | 'error') {
    this.notification = {
      text: message,
      type: type,
      visible: true
    };

    // הסתר את ההודעה אחרי 5 שניות
    setTimeout(() => {
      this.notification.visible = false;    
      this.closeModal()
    }, 5000);
  }

}


// ...................................................................................................................

// let toastIndex = 0;

//         function showError() {
//             const container = document.getElementById('messages-container');
            
//             // הסר הודעות קודמות
//             container.innerHTML = '';
            
//             // צור הודעת שגיאה
//             const errorDiv = document.createElement('div');
//             errorDiv.className = 'error-message';
//             errorDiv.textContent = 'שגיאה! הנתונים שגויים!';
            
//             container.appendChild(errorDiv);
            
//             // הסר לאחר 5 שניות
//             setTimeout(() => {
//                 if (errorDiv.parentNode) {
//                     errorDiv.classList.add('fade-out');
//                     setTimeout(() => {
//                         if (errorDiv.parentNode) {
//                             errorDiv.remove();
//                         }
//                     }, 500);
//                 }
//             }, 5000);
//         }

//         function showSuccess() {
//             // הסר הודעות שגיאה קודמות
//             document.getElementById('messages-container').innerHTML = '';
            
//             // צור toast הצלחה
//             const toastDiv = document.createElement('div');
//             toastDiv.className = 'success-toast';
//             toastDiv.style.setProperty('--toast-index', toastIndex);
//             toastDiv.innerHTML = `
//                 <button class="toast-close" onclick="closeToast(this)">&times;</button>
//                 <span class="toast-content">מעולה! הפעולה בוצעה בהצלחה!</span>
//                 <div class="toast-progress"></div>
//             `;
            
//             document.body.appendChild(toastDiv);
//             toastIndex++;
            
//             // הסר אוטומטית לאחר 4 שניות
//             setTimeout(() => {
//                 closeToast(toastDiv.querySelector('.toast-close'));
//             }, 4000);
//         }

//         function closeToast(closeBtn) {
//             const toast = closeBtn.parentNode;
            
//             toast.classList.add('toast-fade-out');
            
//             setTimeout(() => {
//                 if (toast.parentNode) {
//                     toast.remove();
//                     // עדכן מיקום של toast-ים אחרים
//                     repositionToasts();
//                 }
//             }, 400);
//         }

//         function repositionToasts() {
//             const toasts = document.querySelectorAll('.success-toast');
//             toasts.forEach((toast, index) => {
//                 toast.style.setProperty('--toast-index', index);
//                 toast.style.top = `${80 + (index * 80)}px`;
//             });
//             toastIndex = toasts.length;
//         }

//         // Angular-style usage example
//         const message = {
//             show: true,
//             type: 'success', // או 'error'
//             text: 'הודעה דינמית'
//         };

//         function showMessage(messageObj) {
//             if (messageObj.type === 'error') {
//                 showErrorMessage(messageObj.text);
//             } else if (messageObj.type === 'success') {
//                 showSuccessToast(messageObj.text);
//             }
//         }

//         function showErrorMessage(text) {
//             const container = document.getElementById('messages-container');
//             container.innerHTML = '';
            
//             const errorDiv = document.createElement('div');
//             errorDiv.className = 'error-message';
//             errorDiv.textContent = text;
//             container.appendChild(errorDiv);
//         }

//         function showSuccessToast(text) {
//             const toastDiv = document.createElement('div');
//             toastDiv.className = 'success-toast';
//             toastDiv.style.setProperty('--toast-index', toastIndex);
//             toastDiv.innerHTML = `
//                 <button class="toast-close" onclick="closeToast(this)">&times;</button>
//                 <span class="toast-content">${text}</span>
//                 <div class="toast-progress"></div>
//             `;
            
//             document.body.appendChild(toastDiv);
//             toastIndex++;
            
//             setTimeout(() => {
//                 closeToast(toastDiv.querySelector('.toast-close'));
//             }, 4000);
//         }