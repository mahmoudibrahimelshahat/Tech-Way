import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    redirectTo:'employees',
    pathMatch: 'full'
},

{
    title:'Employees',
    path: 'employees',
    loadComponent: () => import('./pages/employee-list/employee-list.component').then((e) => e.EmployeeListComponent)
},

{
  title: 'Add Employee',
  path:'employees/add',
  loadComponent: () => import('./pages/employee-details/employee-details.component').then((e) => e.EmployeeDetailsComponent)
},

{
  title: 'Employee Details',
  path:'employees/:id/view',
  loadComponent: () => import('./pages/employee-details/employee-details.component').then((e) => e.EmployeeDetailsComponent)
},

{
  title: 'Employee Details',
  path:'employees/:id/edit',
  loadComponent: () => import('./pages/employee-details/employee-details.component').then((e) => e.EmployeeDetailsComponent)
},

];
