import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environment';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  httpClient = inject(HttpClient)
  url = environment.url

  getAllEmployees(): Observable<Employee[]>{
    return this.httpClient.get<Employee[]>(`${this.url}`)
  }
}
