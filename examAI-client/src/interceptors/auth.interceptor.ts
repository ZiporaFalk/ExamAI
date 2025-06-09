import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment.prod'; 


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = req.url.startsWith('http') ? req.url : `${environment.apiUrl}${req.url}`;
  console.log(apiUrl);
  console.log("apiUrl");

  const skipAuth = ['/login', '/register'];
  const shouldSkip = skipAuth.some(path => req.url.includes(path));
  if (shouldSkip) {
    console.log('Skipping auth for:', req.url);
    return next(req.clone({ url: apiUrl }));
  }

  
  const token = localStorage.getItem('token');
  if (token) {
    console.log("tokennn");
    const clonedReq = req.clone({
      url: apiUrl,
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(clonedReq);
  }
  return next(req);
}
