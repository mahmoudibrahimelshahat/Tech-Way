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

  getEmployeeById(id:string): Observable<Employee>{
    return this.httpClient.get<Employee>(`${this.url}/${id}`)
  }

  AddEmployee(employee: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>(`${this.url}`, employee);
  }

  updateEmployee(id: string, employee: Employee): Observable<Employee> {
    return this.httpClient.put<Employee>(`${this.url}/${id}`, employee);
  }

  deleteEmployee(id: string) {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
}
