import { Component, OnInit, signal, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService) { }

  showProfileMenu = signal(false);
  scrolled = signal(false);

  Myprofile = JSON.parse(localStorage.getItem('profile') || 'null');

  currentUser = signal({
    name: 'לא מחובר',
    email: '',
    // avatar: '/images/background.jpg',
    avatar: this.Myprofile?.picture || '/images/background.jpg',
    firstLetter: 'מ'
  });

  ngOnInit(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   document.addEventListener('click', (event) => {
    //     const target = event.target as HTMLElement;
    //     const profileElement = document.querySelector('.user-profile');
    //     if (profileElement && !profileElement.contains(target)) {
    //       this.showProfileMenu.set(false);
    //     }
    //   });
    // }

    this.authService.userProfile$.subscribe(profile => {
      console.log(profile);
      if (profile) {
        this.currentUser.set({
          name: profile.name,
          email: profile.email,
          avatar: profile.picture || '/images/background.jpg',
          firstLetter: profile.name ? profile.name[0].toUpperCase() : 'מ'
        });
        console.log(profile.picture);
        console.log(profile.name);
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const profileElement = document.querySelector('.user-profile');
      if (profileElement && !profileElement.contains(target)) {
        this.showProfileMenu.set(false);
      }
    });
    console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmm");
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled.set(window.scrollY > 50);
    }
  }
  // constructor(private router: Router) { }

  // showProfileMenu = signal(false);
  // scrolled = signal(false);

  // currentUser = signal({
  //   name: 'Alex Johnson',
  //   email: 'alex.johnson@student.edu',
  //   avatar: '/images/background.jpg'
  // });

  toggleProfileMenu(): void {
    this.showProfileMenu.update(current => !current);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToProfile(): void {
    this.showProfileMenu.set(false);
    this.router.navigate(['/profile']);
  }

  navigateToSettings(): void {
    this.showProfileMenu.set(false);
    this.router.navigate(['/settings']);
  }

  navigateToNotifications(): void {
    this.showProfileMenu.set(false);
    this.router.navigate(['/notifications']);
  }

  navigateToHelp(): void {
    this.showProfileMenu.set(false);
    this.router.navigate(['/help']);
  }

  signOut(): void {
    this.showProfileMenu.set(false);
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    localStorage.removeItem('userId');
    this.authService.clearUserProfile(); // איפוס הפרופיל
    this.router.navigate(['/auth']);
  }
  signIn():void{
    this.router.navigate(['/auth']);
  }
  sendEmail() {
    console.log("sendemail");
    const email = 'z0548498935@gmail.com';
    const subject = 'שלום המורה';
    const body = 'שלום, הנה תוכן ההודעה.';
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }
}

