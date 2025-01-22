import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, retry, throwError } from 'rxjs';


export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {

  const toastr = inject(ToastrService) 


  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status == 401) {
        toastr.error('Unauthrized', 'error');
      }
      if (error.status == 404) {
        toastr.error('Not Found', 'error')
      }

      if (error.status == 408) {
        retry(2)
        toastr.error('Network error', 'error')
      }

      if (error.status == 500) {
        toastr.error('Internal Serval Error', 'error')
      }

      if (error.status == 400) {


        if(typeof(error.error) != 'string')
        {
          error.error.forEach( (e:any) => {
            toastr.error(e.description)
          });
        }
        else
        {
         toastr.error(error.error)
        }
      }

      return throwError(() => error)
    })
  );

};
