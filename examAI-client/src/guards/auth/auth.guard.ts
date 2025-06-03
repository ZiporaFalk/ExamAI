import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  const snackBar = inject(MatSnackBar);

  snackBar.open('Please log in to access this page', 'Close', {
    duration: 3000,
    panelClass: 'big-snackbar', // מחלקה מותאמת אישית
  });
  router.navigate(['/auth']);
  return false;
};
