import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const apiUrl = req.url.startsWith('http') ? req.url : `${environment.apiUrl}${req.url}`;
  console.log(apiUrl);
  console.log("apiUrl");

  if (token) {
    const clonedReq = req.clone({
      url: apiUrl,
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(clonedReq);
  }
  return next(req);
}
