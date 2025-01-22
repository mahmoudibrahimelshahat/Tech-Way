import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SharedTableComponent } from '../../shared/shared-table/shared-table.component';
import { ActionButton } from '../../shared/shared-table/actions';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { Employee } from '../../core/models/employee';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, SharedTableComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmployeeListComponent implements OnInit,OnDestroy {
  page = signal<number>(0);
  pageSize = signal<number>(1);
  total = signal<number>(1);
  data = signal<Employee[]>([]);
  employeeService = inject(EmployeeService);
  _unsubscribeAll = new Subject()

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
        console.log(_row, 'view');
      },
      visability: (_row: any) => true,
      icon: 'remove_red_eye',
      color: '#89A839',
    },
    {
      label: 'Edit',
      action: (_row: any) => {
        console.log(_row, 'edit');
      },
      visability: (_row: any) => true,
      icon: 'edit',
      color: '#00173C',
    },
    {
      label: 'Delete',
      action: (_row: any) => {
        console.log(_row, 'delete');
      },
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
      this.data.set([...res]);
      this.total.set(res.length)
    });
  }

  ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete()
  }

}
