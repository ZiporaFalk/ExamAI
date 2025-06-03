import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

declare const google: any;

interface NotificationMessage {
  text: string;
  type: 'success' | 'error';
  visible: boolean;
}

@Component({
  selector: 'app-google-signin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.css']
})
export class GoogleSigninComponent {//implements AfterViewInit {

  notification: NotificationMessage = {
    text: '',
    type: 'success',
    visible: false
  };

  @ViewChild('googleBtn', { static: true }) googleBtn!: ElementRef<HTMLDivElement>;


  constructor(private authService: AuthService, private cd: ChangeDetectorRef, private router: Router) { }

  ngAfterViewInit() {
    if (!google || !google.accounts || !google.accounts.id) {
      console.error('Google Identity Services library not loaded!');
      return;
    }

    google.accounts.id.initialize({
      client_id : environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response),
    });


    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: 'outline', size: 'large' }
    );
    // google.accounts.id.prompt();
  }
  closeModal() {
    this.router.navigate(['/']); // או לכל נתיב שתרצי
  }

  showNotification(message: string, type: 'success' | 'error') {
    console.log('showNotification');
    this.notification = {
      text: message,
      type: type,
      visible: true
    };
    console.log('notification object', this.notification);

    this.cd.detectChanges(); // 👈 זה יכריח את אנגולר לרנדר מיידית

    setTimeout(() => {
      this.notification = {
        ...this.notification,
        visible: false
      };
      this.closeModal()

      this.cd.detectChanges(); // גם פה אם צריך להעלים
    }, 5000);
  }
  // showGooglePrompt() {
  //   google.accounts.id.prompt();
  // }

  handleCredentialResponse(response: any) {
    console.log('Encoded JWT ID token:', response.credential);

    this.authService.googleLogin(response.credential).subscribe({
      next: (data: any) => {
        console.log('Logged in successfully with Google:', data);
        // המשך טיפול
        this.showNotification('Logged in successfully with Google', 'success')
      },
      error: (err: any) => {
        //  this.showNotification(err.message,'error')
        console.error('Error logging in with Google:', err);
        this.showNotification(err.message, 'error')
      }
    });
  }


}
