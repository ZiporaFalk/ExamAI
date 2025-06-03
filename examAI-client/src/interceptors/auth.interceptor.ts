import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // const isRelative = !/^http/.test(req.url);
  // const fullUrl = isRelative ? API_BASE_URL + req.url : req.url;
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

///////////////
// import { HttpInterceptorFn } from '@angular/common/http';
// import { environment } from '../environments/environment';
// export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('token');

//   // אם ה-URL לא מלא (כלומר לא מתחיל ב-http), נוסיף את baseUrl מהסביבה
//   const apiUrl = req.url.startsWith('http') ? req.url : `${environment.apiUrl}${req.url}`;
//   const clonedReq = req.clone({
//     url: apiUrl,
//     setHeaders: token ? {
//       Authorization: `Bearer ${token}`
//     } : {}
//   });
//   return next(clonedReq);
// };
