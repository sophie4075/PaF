import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-sortable-header',
  standalone: true,
  imports: [
    NgIf
  ],
  template:
      `<th (click)="onSort()" class="px-3 py-3 cursor-pointer">
          <div class="px-3 py-3 flex items-center justify-between gap-1 cursor-pointer">
            {{ label }}
            <div *ngIf="sortField === field">
              <span *ngIf="sortDirection === 'asc'">↑</span>
              <span *ngIf="sortDirection === 'desc'">↓</span>
            </div>
          </div>
        </th>
      `
  ,
})
export class SortableHeaderComponent {

  @Input() label!: string;
  @Input() field!: string;
  @Input() sortField!: string;
  @Input() sortDirection!: 'asc' | 'desc' | null;
  @Input() sortable: boolean = true;

  @Output() sort = new EventEmitter<string>();

  onSort() {
    this.sort.emit(this.field);
  }

  isSortedAsc() {
    return this.sortField === this.field && this.sortDirection === 'asc';
  }

  isSortedDesc() {
    return this.sortField === this.field && this.sortDirection === 'desc';
  }

}
