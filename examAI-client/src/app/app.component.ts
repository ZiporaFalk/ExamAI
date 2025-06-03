import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
// import { ExamsComponent } from '../components/exams/exams.component';
// import { StudentDashboardComponent } from '../components/statistics/statistics.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet,RouterModule],
  imports: [RouterModule, MatSnackBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'examAI-manager';
}
