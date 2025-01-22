import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, tap } from 'rxjs';


export const loaderInterceptor: HttpInterceptorFn = (req, next) => {

  let spinnerService = inject(NgxSpinnerService);
  return next(req).pipe(
    tap(() => spinnerService.show()),
    finalize(() => spinnerService.hide())
  );
};
