import {Component, inject} from '@angular/core';
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatDivider} from "@angular/material/divider";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  SortableHeaderComponent
} from "../../../../shared/components/dashboard/sortable-header/sortable-header.component";
import {CustomerRentalInfoDto, CustomerService} from "../../service/customer.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {
  UpdateRentalPeriodComponent
} from "../../../../shared/components/dashboard/update-rental-period/update-rental-period.component";

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    MatCheckbox,
    MatDivider,
    MatPaginator,
    NgForOf,
    ReactiveFormsModule,
    SortableHeaderComponent,
    NgClass,
    FormsModule
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8 min-h-full">
      <div class="py-12">

        <div class="mx-auto grid lg:grid-cols-2 gap-2 mb-8">
          <div class="overflow-hidden shadow-md sm:rounded-lg">
            <div class="p-6 text-gray-900">
              <h3 class="text-blue-400 text-2xl font-semibold">
                Due today
              </h3>
              <p class="text-xl">
                @if (dueRentals.length){
                  <p class="text-lg font-extrabold">{{dueRentals.length}} {{dueRentals.length === 1 ? 'item is' : 'items are' }} due today</p>
                } @else {
                  <p class="text-gray-700 text-base italic">No instances are due today</p>
                }
              </p>
              @for(rental of dueRentals; track $index){
                <div class="my-4 flex flex-column lg:flex-row lg:justify-between items-center gap-1.5">
                  <div>
                    <p class="text-sm text-gray-900">{{ rental.articleDesignation }} {{ rental.inventoryNumber }}</p>
                  </div>
                  <mat-divider></mat-divider>
                </div>
              }
            </div>
          </div>
          <div class="overflow-hidden shadow-md sm:rounded-lg">
            <div class="p-6 text-gray-900">
              <h3 class="text-red-500 text-2xl font-semibold">
                Due today
              </h3>
              <p class="text-xl">
                @if (overDueRentals.length){
                  <p class="text-lg font-extrabold">{{overDueRentals.length}} {{overDueRentals.length === 1 ? 'item is' : 'items are' }} overdue</p>
                } @else {
                  <p class="text-gray-700 text-base italic">No instances are overdue!</p>
                }
              </p>
              @for(rental of overDueRentals; track $index){
                <div class="my-4 flex flex-column lg:flex-row lg:justify-between items-center gap-1.5">
                  <div>
                    <p class="text-sm text-gray-900">{{ rental.articleDesignation }} {{ rental.inventoryNumber }}</p>
                    <p class="text-xs text-gray-700">Was due by {{ rental.rentalEnd }}</p>
                  </div>
                  <mat-divider></mat-divider>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="overflow-auto shadow-md rounded py pb-5">

          <div class="flex justify-between items-center m-4">
            <h1 class="text-xl font-bold">Rental Positions</h1>

            @if(allRentals.length){
              <input
                  [(ngModel)]="searchTerm"
                  placeholder="Search..."
                  class="border p-2 rounded w-1/3 bg-transparent" />
            }

          </div>

          @if (allRentals.length){

            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead class="text xs text-gray-700 uppercase">
              <tr class="text-nowrap flex justify-between items-center">
                <app-sortable-header label="Artikel" field="articleDesignation"
                                     [sortField]="sortField" [sortDirection]="sortDirection"
                                     (sort)="onSortChange($event)">
                </app-sortable-header>
                <app-sortable-header label="Inventory Number" field="articleInstanceInventoryNumber"
                                     [sortField]="sortField" [sortDirection]="sortDirection"
                                     (sort)="onSortChange($event)">
                </app-sortable-header>
                <app-sortable-header label="Rental End" field="rentalEnd"
                                     [sortField]="sortField" [sortDirection]="sortDirection"
                                     (sort)="onSortChange($event)">
                </app-sortable-header>
                <th>
                  <select [(ngModel)]="selectedFilter" class="border p-2 rounded bg-transparent">
                    <option value="ALL">All</option>
                    <option value="CURRENT">Current Active</option>
                    <option value="UPCOMING">Upcoming</option>
                    <option value="DUE">Due Today</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="PAST">Past</option>
                  </select>
                </th>
                <th class="px-3 py-2">Aktionen</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let rental of paginatedRentals()" class="border-b flex justify-between items-center">
                <td class="px-3 py-2">{{ rental.articleDesignation }}</td>
                <td class="px-3 py-2">{{ rental.inventoryNumber }}</td>
                <td class="px-3 py-2">
                  {{ rental.rentalStart | date:'dd.MM.yyyy' }} - {{ rental.rentalEnd | date:'dd.MM.yyyy' }}
                </td>
                <td class="px-3 py-2">
               <span [ngClass]="{
               'text-green-700': getDisplayStatus(rental) === 'Returned',
               'text-blue-500': getDisplayStatus(rental) === 'Current Active' || getDisplayStatus(rental) === 'Upcoming',
               'text-red-500': getDisplayStatus(rental) === 'Overdue',
               'text-yellow-500': getDisplayStatus(rental) === 'Due Today'
               }">
                 {{ getDisplayStatus(rental) }}
               </span>
                </td>
                <td class="px-3 py-2">
                  <div class="flex gap-4 justify-between">
                    @if (getDisplayStatus(rental) !== 'Returned'){
                      <button (click)="openEditDialog(rental)" class="text-blue-500 hover:underline">
                        Edit
                      </button>
                    } 
                    @if (dateCheck(rental)){
                      <button (click)="cancelRentalPosition(rental)" class="text-red-500 hover:underline ml-2">
                        Cancel
                      </button>
                    }
                  </div>
                  
                </td>
              </tr>
              </tbody>
            </table>

            <div class="flex justify-center items-center">
              <mat-paginator
                  [length]="getProcessedRentals().length"
                  [pageSize]="pageSize"
                  [pageSizeOptions]="[5, 10, 25, 100]"
                  [pageIndex]="pageIndex"
                  (page)="onPageChange($event)">
              </mat-paginator>
            </div>


          } @else {
            <p class="text-gray-700 text-base italic m-4">No instances are currently borrowed</p>
          }

        </div>

      </div>
    </div>
  `,
})
export class CustomerDashboardComponent {
  selectedFilter: 'ALL' | 'CURRENT' | 'UPCOMING' | 'DUE' | 'OVERDUE' | 'PAST' = 'ALL';
  allRentals: CustomerRentalInfoDto[] = [];
  dueRentals: CustomerRentalInfoDto[] = [];
  overDueRentals: CustomerRentalInfoDto[] = [];

  private _snackBar = inject(MatSnackBar);

  searchTerm: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' | null = null;

  pageSize = 10;
  pageIndex = 0;

  ngOnInit() {

    this.loadAllRentalPos();

    this.sortField = 'rentalEnd';
    this.sortDirection = 'asc';
  }

  constructor(private customerService: CustomerService, private dialog: MatDialog) {}

  loadAllRentalPos() {
    this.customerService.getAllRentalPositions().subscribe((data) => {
      this.allRentals = data;

      const today = new Date()
      today.setHours(0, 0, 0, 0);

      this.dueRentals = this.allRentals.filter(rental => {
        const rentalEnd = new Date(rental.rentalEnd);
        rentalEnd.setHours(0, 0, 0, 0);
        return rentalEnd.getTime() === today.getTime();
      });

      this.overDueRentals = this.allRentals.filter(rental => {
        const rentalEnd = new Date(rental.rentalEnd);
        rentalEnd.setHours(0, 0, 0, 0);
        return rentalEnd < today;
      });


    });
  }

  openEditDialog(rental: CustomerRentalInfoDto) {
    const dialogRef = this.dialog.open(UpdateRentalPeriodComponent, {
      data: { rental }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.newRentalStart|| result.newRentalEnd) {


        const formattedNewStart = this.customerService.formatToLocalDate(result.newRentalStart);
        const formattedNewEnd = this.customerService.formatToLocalDate(result.newRentalEnd);

        const body: any = {};

        if (formattedNewStart) {
          body.rentalStart = formattedNewStart;
        }
        if (formattedNewEnd) {
          body.rentalEnd = formattedNewEnd;
        }

        this.customerService.updateRentalPeriod(rental.rentalPositionId, body)
            .subscribe({
              next: updated => {
                rental.rentalEnd = updated.rentalEnd;
                this._snackBar.open('Rental period updated ', ' 🎉', { duration: 3000 });
              },
              error: err => {
                if (err.status === 409) {
                  this._snackBar.open('Rental period cannot be adjusted as there are overlaps.', 'OK 🤖', { duration: 5000 });
                } else {
                  const errorMessage = err.error?.message || 'An error occurred';
                  this._snackBar.open(`Error: ${errorMessage}`, '🤖', {
                    duration: 5000,
                  });
                }
              }}
            );
      }
    });
  }

  onSortChange(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  paginatedRentals(): CustomerRentalInfoDto[] {
    const filtered = this.getProcessedRentals();
    const start = (this.pageIndex) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  getDisplayStatus(rental: CustomerRentalInfoDto): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rentalStart = new Date(rental.rentalStart);
    const rentalEnd = new Date(rental.rentalEnd);
    rentalStart.setHours(0, 0, 0, 0);
    rentalEnd.setHours(0, 0, 0, 0);

    const isReturned = rentalEnd < today && rental.status !== 'OVERDUE';
    const isDueToday = rentalEnd.getTime() === today.getTime();
    const isUpcoming = rentalStart > today;
    const isCurrent = rentalStart <= today && rentalEnd >= today && rental.status === 'RENTED';
    const isOverdue = rental.status === 'OVERDUE';

    const statusMap: { [key: string]: boolean } = {
      'Returned': isReturned,
      'Due Today': isDueToday,
      'Upcoming': isUpcoming,
      'Current Active': isCurrent,
      'Overdue': isOverdue
    };

    for (const [status, condition] of Object.entries(statusMap)) {
      if (condition) return status;
    }

    return rental.status;
  }

  getProcessedRentals(): CustomerRentalInfoDto[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.allRentals
        .filter(rental => {
          // Filter nach selectedFilter (PAST, CURRENT, etc.)
          const rentalStart = new Date(rental.rentalStart);
          const rentalEnd = new Date(rental.rentalEnd);
          rentalStart.setHours(0, 0, 0, 0);
          rentalEnd.setHours(0, 0, 0, 0);

          switch (this.selectedFilter) {
            case 'CURRENT':
              if (!(rentalStart <= today && rentalEnd >= today && rental.status === 'RENTED')) return false;
              break;
            case 'UPCOMING':
              if (!(rentalStart > today)) return false;
              break;
            case 'DUE':
              if (!(rentalEnd.getTime() === today.getTime())) return false;
              break;
            case 'OVERDUE':
              if (!(rentalEnd < today && rental.status === 'OVERDUE')) return false;
              break;
            case 'PAST':
              if (!(rentalEnd < today && rental.status !== 'OVERDUE')) return false;
              break;
            default:
              'ALL'
              break;
          }

          const term = this.searchTerm.toLowerCase();
          const matchesSearch =
              rental.articleDesignation.toLowerCase().includes(term) ||
              rental.inventoryNumber.toLowerCase().includes(term)

          return matchesSearch || !term;
        })
        .sort((a, b) => {
          // Sort
          if (this.sortField && this.sortDirection) {
            let valA: any, valB: any;

            /*if (this.sortField === 'name') {
              valA = `${a.userFirstName} ${a.userLastName}`.toLowerCase();
              valB = `${b.userFirstName} ${b.userLastName}`.toLowerCase();
            } else */
            if (this.sortField === 'rentalEnd') {
              valA = new Date(a.rentalEnd);
              valB = new Date(b.rentalEnd);
            } else {
              valA = (a as any)[this.sortField]?.toLowerCase?.() ?? (a as any)[this.sortField];
              valB = (b as any)[this.sortField]?.toLowerCase?.() ?? (b as any)[this.sortField];
            }

            if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
          }

          return 0;
        });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  cancelRentalPosition(rental: CustomerRentalInfoDto) {
    if (confirm('Are you sure you want to cancel this rental position?')) {
      this.customerService.deleteRentalPosition(rental.rentalPositionId).subscribe({
        next: () => {
          this.allRentals = this.allRentals.filter(r => r.rentalPositionId !== rental.rentalPositionId);
          this._snackBar.open('Rental position canceled successfully', '🚮', { duration: 3000 });
        },
        error: err => {
          const errorMsg = err.error?.message || 'An error occurred';
          this._snackBar.open(`Error: ${errorMsg}`, '🤖', { duration: 5000 });
        }
      });
    }
  }

  dateCheck(rental: CustomerRentalInfoDto): boolean {
    return new Date(rental.rentalStart).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
  }
}
