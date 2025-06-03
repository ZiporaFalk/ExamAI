import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // 👈 הוספה חשובה
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // provideHttpClient(),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor]) // 🟢 זו השורה החשובה
    ),
  ]

};
 // ........................
    // importProvidersFrom(SocialLoginModule),
    // {
    //   provide: 'alAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider('95515128712-njsrh6ah7f90pvtf24rld5b74tca65ke.apps.googleusercontent.com'), // 🔁 שימי את ה-client ID שלך כאן
    //       },
    //     ],
    //   } as SocialAuthServiceConfig,
    // }
    // .........................
// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';
// import { provideClientHydration } from '@angular/platform-browser';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { provideHttpClient } from '@angular/common/http';
// import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideClientHydration(),
//     provideAnimationsAsync(),
//     provideHttpClient(),
//     importProvidersFrom(SocialLoginModule),
//     {
//       provide: 'alAuthServiceConfig',
//       useValue: {
//         autoLogin: false,
//         providers: [
//           {
//             id: GoogleLoginProvider.PROVIDER_ID,
//             provider: new GoogleLoginProvider('95515128712-njsrh6ah7f90pvtf24rld5b74tca65ke.apps.googleusercontent.com'), // 🔁 שימי את ה-client ID שלך כאן
//           },
//         ],
//       } as SocialAuthServiceConfig,
//     }
//   ]
// };