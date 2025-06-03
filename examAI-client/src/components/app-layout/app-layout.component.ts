import { Component } from '@angular/core';

import { Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterModule, FooterComponent, HeaderComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {
  isAuthRoute = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isAuthRoute = this.router.url.startsWith('/auth');
    });
  }
}
