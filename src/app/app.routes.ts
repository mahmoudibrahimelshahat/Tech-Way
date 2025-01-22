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

];
