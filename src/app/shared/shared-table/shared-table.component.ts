import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild, WritableSignal } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ActionButton } from './actions';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-shared-table',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatMenuModule, MatIconModule,MatFormFieldModule,MatInputModule],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTableComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() displayedColumns: WritableSignal<any[]>;
  @Input() set dataSource(data: any[]) {
    this._dataSource.data = data;
  }
  @Input() actions: WritableSignal<ActionButton[]>;
  @Input() pageSize: WritableSignal<number>;
  @Input() page: WritableSignal<number>;
  @Input() total: WritableSignal<number>;

  _dataSource = new MatTableDataSource<any>();
  filter: string = '';

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }

  get displayedColumnKeys(): string[] {
    return this.displayedColumns().map((col: any) => col.value);
  }

  onPageChange(event: any) {
    this.page.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this._dataSource.filter = filterValue.trim().toLowerCase();
    if (this._dataSource.paginator) {
      this._dataSource.paginator.firstPage();
    }
  }
}
