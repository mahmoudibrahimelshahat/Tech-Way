import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SharedTableComponent } from '../../shared/shared-table/shared-table.component';
import { ActionButton } from '../../shared/shared-table/actions';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { Employee } from '../../core/models/employee';
import { Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, SharedTableComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmployeeListComponent implements OnInit,OnDestroy {
  page = signal<number>(0);
  pageSize = signal<number>(5);
  total = signal<number>(0);
  data = signal<Employee[]>([]);
  employeeService = inject(EmployeeService);
  router= inject(Router)
  dialog = inject(MatDialog)
  activatedRouter= inject(ActivatedRoute)
  _unsubscribeAll = new Subject()
  toastrService = inject(ToastrService)
  addEmployee = signal<boolean>(true)
  columns = signal<{ viewValue: string; value: string }[]>([
    { viewValue: 'Name', value: 'name' },
    { viewValue: 'Department', value: 'department' },
    { viewValue: 'Position', value: 'position' },
    { viewValue: 'Salary', value: 'salary' },
    { viewValue: 'Actions', value: 'actions' },
  ]);

  actions = signal<ActionButton[]>([
    {
      label: 'View',
      action: (_row: any) => {
        this.router.navigate([`${_row._id}/view`],{relativeTo:this.activatedRouter})
      },
      visability: (_row: any) => true,
      icon: 'remove_red_eye',
      color: '#89A839',
    },
    {
      label: 'Edit',
      action: (_row: any) => {
        this.router.navigate([`${_row._id}/edit`],{relativeTo:this.activatedRouter})
      },
      visability: (_row: any) => true,
      icon: 'edit',
      color: '#00173C',
    },
    {
      label: 'Delete',
      action: (_row: any) => this.deleteEmployee(_row),
      visability: (_row: any) => true,
      icon: 'delete',
      color: 'red',
    },
  ]);

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().pipe(takeUntil(this._unsubscribeAll)).subscribe((res:any) => {
    this.total.set(res.length);
    const startIndex = this.page() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    const paginatedData = res.slice(startIndex, endIndex);

    this.data.set([...paginatedData]);
    });
  }

  onPageChange(e: any) {
    this.page.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.getAllEmployees();
  }

  deleteEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '300px',
      data: { title:'Delete Employee' ,  message: `Are you sure you want to delete ${employee.name}?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeService.deleteEmployee(employee._id).pipe(takeUntil(this._unsubscribeAll)).subscribe(res=>{
          this.toastrService.success(`Employee Deleted Successfully`)
          this.getAllEmployees()
        },err=>{
          
          // Note :D i know i should do this but there is something error in delete api
          // so in response there is already message but in console there is error like fail api how :)

          this.toastrService.success(`Employee Deleted Successfully`)

          const currentPage = this.page();
          const totalAfterDeletion = this.total() - 1;
          const itemsPerPage = this.pageSize();
          if (currentPage > 0 && currentPage * itemsPerPage >= totalAfterDeletion) {
            this.page.set(currentPage - 1);
          }
          this.getAllEmployees()
        });
      }
    });
  }

  onNavigate(e:boolean){
    this.router.navigate(['add'],{relativeTo: this.activatedRouter})
  }

  ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete()
  }

}
