// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-home-page',
//   imports: [],
//   templateUrl: './home-page.component.html',
//   styleUrl: './home-page.component.css'
// })
// export class HomePageComponent {

// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomeComponent {

  constructor(private router: Router) { }

  GetStarted() {
    this.router.navigate(['/auth']);
  }
  
  features = [
    {
      icon: 'chart-bar',
      title: 'Performance Analytics',
      description: 'Visualize your academic progress with intuitive charts and identify your strengths and areas for improvement.',
      delay: '0s'
    },
    {
      icon: 'document-text',
      title: 'Detailed Feedback',
      description: 'Access comprehensive feedback on your exams, including downloadable documents and scanned tests.',
      delay: '0.2s'
    },
    {
      icon: 'calendar',
      title: 'Exam Management',
      description: 'Organize your exams by subject, track submission dates, and submit appeals when needed.',
      delay: '0.4s'
    }
  ];

  quickLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Exams', href: '/exams' },
    { label: 'Calendar', href: '/calendar' }
  ];

  resources = [
    { label: 'Help Center', href: '/help' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' }
  ];
}