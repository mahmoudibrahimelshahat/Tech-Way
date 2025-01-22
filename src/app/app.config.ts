import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { errorHandlingInterceptor } from './core/interceptors/error-handler/error-handler.interceptor';
import { loaderInterceptor } from './core/interceptors/loader-interceptor/loader-interceptor.interceptor';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes,withViewTransitions()),
      provideAnimationsAsync(),
      provideHttpClient(
        withInterceptors([
        errorHandlingInterceptor,
        loaderInterceptor
      ])),
      provideToastr({
        timeOut: 10000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
      }),
    NgxSpinnerModule,
    {
      provide: 'SPINNER_CONFIG',
      useValue: {
        type: 'pacman',
        bdColor: 'rgba(0, 0, 0, 0.7)',
        size: 'medium',
        color: '#fff',
        fullScreen: true,
      },
    },
    {
      provide: NgxSpinnerService,
      useClass: NgxSpinnerService,
    },
    ]
};
