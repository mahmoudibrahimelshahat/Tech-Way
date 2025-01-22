import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../core/models/employee';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {
  employeeService = inject(EmployeeService);
  toastrService = inject(ToastrService);
  _unsubscribeAll = new Subject();
  id = signal<string>('');
  employeeInfo = signal<Employee>({
    _id: '',
    name: '',
    position: '',
    department: '',
    salary: 0,
  });

  isEditMode = signal<boolean>(false);
  isAddMode = signal<boolean>(false); // Add mode flag
  employeeForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initializeForm();

    activatedRoute.paramMap.pipe(takeUntil(this._unsubscribeAll)).subscribe((param) => {
      this.id.set(param.get('id')!);
    });

    this.isEditMode.set(this.router.url.includes('edit'));
    this.isAddMode.set(this.router.url.includes('add'));
  }

  ngOnInit(): void {
    if (!this.isAddMode()) {
      this.getEmployeeById();
    }
  }

  initializeForm() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get formControls() {
    return this.employeeForm.controls;
  }

  getEmployeeById() {
    this.employeeService
      .getEmployeeById(this.id())
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.employeeInfo.set({ ...res });
        if (this.isEditMode()) {
          this.employeeForm.patchValue(res);
        }
      });
  }

  saveChanges() {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;

      if (this.isEditMode()) {
        const updatedEmployee = { ...this.employeeInfo(), ...employeeData };
        this.employeeService
          .updateEmployee(this.id(), updatedEmployee)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(res=>{
              this.toastrService.success('Employee Updated Successfully');
              this.router.navigate(['/employees']);
            });
      } else if (this.isAddMode()) {
        this.employeeService
          .AddEmployee(employeeData)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(res=>{
              this.toastrService.success('Employee Added Successfully');
              this.router.navigate(['/employees']);
            });
      }
    }
  }

  cancelEdit() {
    this.router.navigate(['/employees']);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
