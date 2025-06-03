import { Routes } from '@angular/router';
// import { AppLayoutComponent } from '../components/app-layout/app-layout.component';
import { HomeComponent } from '../components/home-page/home-page.component';
import { AuthComponent } from '../components/auth/auth.component';
import { ExamsComponent } from '../components/exams/exams.component';
import { StudentDashboardComponent } from '../components/statistics/statistics.component';
import { AppLayoutComponent } from '../components/app-layout/app-layout.component';
import { authGuard } from '../guards/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'auth', component: AuthComponent },
            { path: 'exams', component: ExamsComponent, canActivate: [authGuard] },
            { path: 'dashboard', component: StudentDashboardComponent , canActivate: [authGuard]},
        ]
    }
];
